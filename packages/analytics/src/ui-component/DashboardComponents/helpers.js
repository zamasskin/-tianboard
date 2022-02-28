import _ from 'lodash';

export function series(value, defaultValue = { selected: [], names: {} }) {
    const { selected = [], names = {} } = value || defaultValue || {};
    return {
        selected,
        names,
        type: 'series',
        getSettingValues() {
            return {
                selected: this.selected,
                names: this.names
            };
        },
        getValues(data) {
            return this.selected.map((key) => ({
                name: this.names[key] || key,
                data: _.isArray(data) ? data.map((val) => _.get(val, key)) : []
            }));
        },
        getSelected() {
            return this.selected;
        },
        getNames() {
            return _.chain(this.value)
                .entries()
                .map(([key, name]) => ({ key, name }))
                .value();
        },
        getName(key) {
            return this.names[key] || '';
        },
        setName(key, name) {
            this.names = { ...this.names, [key]: name };
        },
        setSelected(newSelected) {
            this.selected = newSelected;
        },
        setValue(newValue) {
            const { selected = [] } = newValue || defaultValue || {};
            this.selected = selected;
            this.value = value;
        }
    };
}

export default {};
