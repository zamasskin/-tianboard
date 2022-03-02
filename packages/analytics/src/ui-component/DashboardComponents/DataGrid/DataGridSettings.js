import _ from 'lodash';
import { Grid, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import PropTypes from 'prop-types';

import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';

export const defWidth = 120;
export const defAlign = 'left';
export const defHeaderAlign = 'left';

export const valueAlign = [
    { value: 'left', label: 'По левому краю' },
    { value: 'center', label: 'По центру' },
    { value: 'right', label: 'По правому краю' }
];

// headerAlign
export const settingsColumns = (onAction) => [
    { field: 'id', headerName: 'Поле', width: 150, sortable: false, filterable: false },
    { field: 'headerName', headerName: 'Название', width: 90, editable: true, sortable: false, filterable: false },
    { field: 'width', headerName: 'Ширина', width: 80, editable: true, type: 'number', sortable: false, filterable: false },
    {
        field: 'align',
        headerName: 'Выравнивание строк',
        width: 150,
        editable: true,
        type: 'singleSelect',
        valueOptions: valueAlign,
        sortable: false,
        filterable: false
    },
    {
        field: 'headerAlign',
        headerName: 'Выравнивание колонок',
        width: 150,
        editable: true,
        type: 'singleSelect',
        valueOptions: valueAlign,
        sortable: false,
        filterable: false
    },
    {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        // renderCell: RowMenuCell,
        sortable: false,
        width: 100,
        headerAlign: 'center',
        filterable: false,
        align: 'center',
        disableColumnMenu: true,
        disableReorder: true,
        getActions(props) {
            return [
                <IconButton aria-label="up" onClick={() => onAction('up', props)}>
                    <ArrowUpwardIcon />
                </IconButton>,
                <IconButton aria-label="down" onClick={() => onAction('down', props)}>
                    <ArrowDownwardIcon />
                </IconButton>
            ];
        }
    }
];

const DataGridSettings = ({ data, settings: componentSettings, onChange }) => {
    const keys = _.chain(data).head().keys().value();
    const settingsName = getSettingsName('DataGrid');
    const defaultRows = keys.map((key, i) => ({ id: key, field: key, headerName: key, sort: i + 1 }));
    const settings = _.get(componentSettings, settingsName) || {};
    const { columnsSettings = [], selected = keys } = settings;
    const rows = _.chain(defaultRows).keyBy('id').merge(_.keyBy(columnsSettings, 'id')).values().sortBy('sort').value();

    const onEdit = (newColumnsSettings) => {
        newColumnsSettings = _.chain(newColumnsSettings)
            .mapValues((settingsRow) => _.mapValues(settingsRow, 'value'))
            .value();
        newColumnsSettings = _.merge(_.keyBy(rows, 'id'), newColumnsSettings);
        newColumnsSettings = _.values(newColumnsSettings);
        if (onChange) {
            onChange({ ...settings, columnsSettings: newColumnsSettings });
        }
    };

    const onAction = (action, { row }) => {
        if (action === 'up') {
            if (row.sort > 0) {
                row.sort -= 1.1;
            }
        }
        if (action === 'down') {
            if (row.sort < rows.length) {
                row.sort += 1 + 0.1;
            }
        }

        const newColumnsSettings = _.chain(rows)
            .keyBy('id')
            .merge({ [row.id]: row })
            .values()
            .sortBy('sort')
            // .map((val) => _.omit(val, ['weight']))
            .map((val, i) => ({ ...val, sort: i + 1 }))
            .value();

        if (onChange) {
            onChange({ ...settings, columnsSettings: newColumnsSettings });
        }
    };

    return (
        <Grid container>
            <Grid item xs>
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        disableSelectionOnClick
                        sort
                        rows={_.orderBy(rows, ['sort'])}
                        columns={settingsColumns(onAction)}
                        checkboxSelection
                        selectionModel={selected}
                        onSelectionModelChange={(selected) => onChange && onChange({ ...settings, selected })}
                        onEditRowsModelChange={onEdit}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

DataGridSettings.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object,
    onChange: PropTypes.func
};

export default DataGridSettings;
