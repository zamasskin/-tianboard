import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

export const defWidth = 100;
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
    headerName: key,
    hide: false,
    width: defWidth,
    align: defAlign,
    headerAlign: defHeaderAlign
});

export const getColumns = (data, settings) => {
    const keys = _.chain(data).head().keys().value();
    const columnSelection = settings?.columnSelection || keys;
    const { columnsSetting = {} } = settings;
    const getColumn = (key) => _.merge(defaultColumn(key), columnsSetting[key]);
    return keys.map((key) => ({ ...getColumn(key), hide: !columnSelection.includes(key) }));
};

export const getSettingsRows = (data, settings) => {
    const { columnsSetting = {} } = settings;
    const getSettings = (key) => columnsSetting[key] || { headerName: key, width: defWidth, align: defAlign, headerAlign: defHeaderAlign };

    const keys = _.chain(data).head().keys().value();
    return keys.map((key) => ({
        id: key,
        ...getSettings(key)
    }));
};

export const getUpdateSettings = (newSettings, oldSettings) => {
    const { columnsSetting = {} } = oldSettings;
    const defaults = _.chain(newSettings)
        .keys()
        .map((key) => defaultColumn(key))
        .keyBy('field')
        .value();

    const newColumnsSetting = _.merge(
        defaults,
        columnsSetting,
        _.chain(newSettings)
            .mapValues((setting) => _.mapValues(setting, ({ value }) => value))
            .value()
    );

    return { ...oldSettings, columnsSetting: newColumnsSetting };
};

export const getSelection = (data, settings) => {
    const keys = _.chain(data).head().keys().value();
    return settings?.columnSelection || keys;
};

export const getRows = (data) => data.map((items) => ({ ...items, id: items.id || uuidv4() }));
