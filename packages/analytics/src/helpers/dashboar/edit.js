import _, { toNumber } from 'lodash';

const types = {
    objectOf: 'objectOf',
    arrayOf: 'arrayOf',
    templateFn: 'templateFn',
    data: 'data',
    variantOf: 'variantOf',
    string: 'string',
    number: 'number',
    boolean: 'boolean'
};

export function parseValue({ settings, data }) {
    if (_.isFunction(settings?.getValues)) {
        return settings.getValues(data);
    }
    return settings;
}

export function parseSettings({ settings }) {
    if (_.isFunction(settings?.getSettingValues)) {
        return settings.getSettingValues();
    }
    return settings;
}

export function caValues({ settings }) {
    return {
        $values(data) {
            return parseValue({ settings, data });
        },
        $jsonValues(data) {
            return JSON.stringify(this.$values(data));
        },

        $settings() {
            return parseSettings({ settings });
        },
        $settingsJson() {
            return JSON.stringify(this.$settings());
        }
    };
}

export function canSettings({ settings }) {
    return {
        $$change() {
            if (_.isFunction(this.$onSettingsChange)) {
                this.$onSettingsChange(this.$settings());
            }
        },
        $settings() {
            return parseSettings({ settings });
        },
        $registerChange(onChange) {
            this.$onSettingsChange = onChange;
        },
        $settingsJson() {
            return JSON.stringify(this.$settings());
        },
        $setValue(path, newValue) {
            const childSettings = _.get(settings, path);
            if (_.isFunction(childSettings?.setValue)) {
                childSettings.setValue(newValue);
            }
            this.$$change();
        },
        $call(path, ...params) {
            const call = _.get(settings, path);
            if (_.isFunction(call)) {
                const fn = _.partial(call, ...params);
                fn();
            }
        },
        $getSettingValues(path) {
            const child = _.get(settings, path);
            if (_.isFunction(child?.getSettingValues)) {
                return child.getSettingValues();
            }
            return undefined;
        },
        $get(path) {
            return _.get(settings, path);
        },
        $exec(path, method, ...args) {
            const child = _.get(settings, path);
            if (!child || !_.isFunction(child[method])) {
                return false;
            }
            const result = child[method].call(child, ...args);
            this.$$change();
            return result;
        }
    };
}

export function boolean(value, defaultValue = false) {
    return {
        value,
        defaultValue,
        type: types.boolean,
        getValues() {
            const value = this.value || this.defaultValue;
            return _.isBoolean(value) ? !!value : false;
        },
        getSettingValues() {
            return _.isBoolean(value) ? !!value : false;
        },
        setValue(newValue) {
            this.value = _.isBoolean(value) ? !!newValue : false;
        }
    };
}

export function string(value, defaultValue = '') {
    return {
        value,
        defaultValue,
        type: types.string,
        getValues() {
            return _.toString(this.value || this.defaultValue || '');
        },
        getSettingValues() {
            return _.toString(this.value || this.defaultValue || '');
        },
        setValue(newValue) {
            this.value = _.toString(newValue || '');
        }
    };
}

export function number(value, defaultValue = 0) {
    return {
        value,
        defaultValue,
        type: types.number,
        getValues() {
            return _.toNumber(this.value) || toNumber(this.defaultValue) || 0;
        },
        getSettingValues() {
            return _.toNumber(this.value) || toNumber(this.defaultValue) || 0;
        },
        setValue(newValue) {
            this.value = _.toNumber(newValue) || 0;
        }
    };
}

export function data(value, defaultValue = '') {
    return {
        value,
        defaultValue,
        type: types.data,
        getValues(data) {
            const value = this.value || this.defaultValue;
            return _.isArray(data) ? data.map((val) => _.get(val, value)).filter((val) => !!val) : [];
        },
        getSettingValues() {
            return _.toString(this.value || this.defaultValue || '');
        },
        setValue(newValue) {
            this.value = newValue ? _.toString(newValue) : '';
        }
    };
}

export function arrayOf(value, defaultValue = []) {
    return {
        value,
        defaultValue,
        type: types.arrayOf,
        getValues(data) {
            const value = this.value || this.defaultValue;
            return _.isArray(value) ? value.map((settings) => parseValue({ settings, data })) : [];
        },
        getSettingValues() {
            const value = this.value || this.defaultValue;
            return _.isArray(value) ? value.map((settings) => parseSettings({ settings })) : [];
        },
        setValue(newValue) {
            this.value = _.isArray(newValue) ? newValue : [];
        }
    };
}

export function objectOf(value, defaultValue = {}) {
    let values = { ...(value || defaultValue || {}) };
    return {
        ...value,
        type: types.objectOf,
        getValues(data) {
            return _.isObject(values) ? _.mapValues(values, (settings) => parseValue({ settings, data })) : {};
        },
        getSettingValues() {
            return _.isObject(values) ? _.mapValues(value, (settings) => parseSettings({ settings })) : {};
        },
        setValue(newValue) {
            values = newValue;
        }
    };
}

export function variantOf(value, defaultValue = '') {
    return {
        value,
        defaultValue,
        type: types.variantOf,
        getValues(data) {
            return data;
        },
        getSettingValues() {
            return _.toString(this.value || '');
        },
        setValue(newValue) {
            this.value = _.toString(newValue || '');
        }
    };
}

export function templateFn(value, argsName = []) {
    return {
        value,
        type: types.templateFn,
        getValues() {
            const value = this.value;
            if (!(_.isString(value) && value.length > 0)) {
                return false;
            }
            function callTemplate(...args) {
                const props = _.isArray(argsName)
                    ? _.chain(argsName)
                          .map((name, i) => ({ name, value: args[i] }))
                          .keyBy('name')
                          .mapValues('value')
                          .value()
                    : {};
                const compiled = _.template(value);
                return compiled(props);
            }
            return callTemplate;
        },
        getSettingValues() {
            return this.value;
        },
        setValue(newValue) {
            this.value = newValue;
        }
    };
}

export default {};
