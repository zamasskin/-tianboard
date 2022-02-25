import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { HyperFormula } from 'hyperformula';
import YAML from 'yaml';

import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';
import { defaultConfig } from './config';

export const defWidth = 120;
export const defAlign = 'left';
export const defHeaderAlign = 'left';

export const valueAlign = [
    { value: 'left', label: 'По левому краю' },
    { value: 'center', label: 'По центру' },
    { value: 'right', label: 'По правому краю' }
];

// headerAlign
export const settingsColumns = [
    { field: 'id', headerName: 'Поле', width: 150 },
    { field: 'headerName', headerName: 'Название', width: 90, editable: true },
    { field: 'width', headerName: 'Ширина', width: 80, editable: true, type: 'number' },
    {
        field: 'align',
        headerName: 'Выравнивание строк',
        width: 150,
        editable: true,
        type: 'singleSelect',
        valueOptions: valueAlign
    },
    {
        field: 'headerAlign',
        headerName: 'Выравнивание колонок',
        width: 150,
        editable: true,
        type: 'singleSelect',
        valueOptions: valueAlign
    }
];

export const defaultColumn = (key) => ({
    field: key,
    headerName: key
});

export const getColumns = (data, settings) => {
    const keys = _.chain(data).head().keys().value();
    const dataGridColumnSelection = settings?.dataGridColumnSelection || keys;
    const { dataGridColumnsSetting = {} } = settings;
    const getColumn = (key) => _.merge(defaultColumn(key), dataGridColumnsSetting[key]);
    return _.chain(keys)
        .map((key) => ({ ...getColumn(key), hide: !dataGridColumnSelection.includes(key) }))
        .orderBy('order')
        .value();
};

const parseSettings = (data, settings) => {
    const settingsName = getSettingsName('DataGrid');
    return _.has(settings, settingsName) ? YAML.parse(settings[settingsName]) : defaultConfig(data);
};

export const getSettingsRows = (data, settings) => {
    const { columns = {} } = parseSettings(data, settings);
    const getSettings = (key) => columns[key] || defaultColumn(key);

    const keys = _.chain(data).head().keys().value();
    return keys.map((key) => ({
        id: key,
        ...getSettings(key)
    }));
};

export const getUpdateSettings = (newSettings, settings) => {
    const { columns = {} } = settings;

    const prepareNewColumns = _.chain(newSettings)
        .mapValues((setting) => _.mapValues(setting, ({ value }) => value))
        .value();
    const newColumns = _.chain(columns)
        .keyBy('field')
        .merge(prepareNewColumns)
        .mapValues((value) => _.omit(value, 'field'))
        .value();

    const code = YAML.stringify({ ...settings, columns: newColumns });
    return code;
};

export const getCodeWhenSelected = (selected, settings) => {
    const { columns } = settings;
    const selectedValues = _.chain(selected)
        .map((field) => ({ headerName: field }))
        .keyBy('headerName')
        .value();
    const columnsObj = _.chain(columns)
        .keyBy('field')
        .mapValues((value) => _.omit(value, 'field'))
        .value();
    const newColumns = _.chain(selectedValues).merge(columnsObj).pick(selected).value();
    const code = YAML.stringify({ ...settings, columns: newColumns });
    return code;
};

export const getSelection = (data, settings) => {
    const { columns } = parseSettings(data, settings);
    const keys = _.chain(data).head().keys().value();
    return columns ? _.keys(columns) : keys;
};

export const getRows = (data, settings) => {
    const options = {
        licenseKey: 'gpl-v3'
    };

    const hf = HyperFormula.buildFromArray(
        data.map((items) => Object.values(items)),
        options
    );

    const { columns } = settings;

    const prepareData = data.map((items, i) => {
        Object.entries(columns).forEach(([key, value]) => {
            const { formula } = value;
            if (formula) {
                const prepareFormula = formula.replace(/this\.(\w)+/g, `$1${i + 1}`);
                items[key] = hf.calculateFormula(prepareFormula, 0);
            }
        });
        return { id: uuidv4(), ...items };
    });

    return prepareData;
};

export const getSettings = (data, settings) => {
    try {
        const settingsName = getSettingsName('DataGrid');
        const componentSettings = _.has(settings, settingsName) ? YAML.parse(settings[settingsName]) : defaultConfig(data);
        const { width = '100%', height = 500, columns: configColumns } = componentSettings;
        const columns = _.chain(configColumns)
            .map((settings, field) => ({ ...settings, field }))
            .value();
        return { ...componentSettings, width, height, columns };
    } catch (error) {
        return { width: '100%', height: 500, columns: [], error };
    }
};
