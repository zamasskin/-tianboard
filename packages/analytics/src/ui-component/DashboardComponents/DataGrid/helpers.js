import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { HyperFormula } from 'hyperformula';

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
    },
    { field: 'order', headerName: 'Сортировка', width: 80, editable: true, type: 'number' }
];

export const defaultColumn = (key) => ({
    field: key,
    headerName: key,
    hide: false,
    width: defWidth,
    align: defAlign,
    headerAlign: defHeaderAlign,
    order: 500
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

export const getSettingsRows = (data, settings) => {
    const { dataGridColumnsSetting = {} } = settings;
    const getSettings = (key) => dataGridColumnsSetting[key] || defaultColumn(key);

    const keys = _.chain(data).head().keys().value();
    return keys.map((key) => ({
        id: key,
        ...getSettings(key)
    }));
};

export const getUpdateSettings = (newSettings, oldSettings) => {
    const { dataGridColumnsSetting = {} } = oldSettings;
    const defaults = _.chain(newSettings)
        .keys()
        .map((key) => defaultColumn(key))
        .keyBy('field')
        .value();

    const newDataGridColumnsSetting = _.merge(
        defaults,
        dataGridColumnsSetting,
        _.chain(newSettings)
            .mapValues((setting) => _.mapValues(setting, ({ value }) => value))
            .value()
    );

    return { ...oldSettings, dataGridColumnsSetting: newDataGridColumnsSetting };
};

export const getSelection = (data, settings) => {
    const keys = _.chain(data).head().keys().value();
    return settings?.dataGridColumnSelection || keys;
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
