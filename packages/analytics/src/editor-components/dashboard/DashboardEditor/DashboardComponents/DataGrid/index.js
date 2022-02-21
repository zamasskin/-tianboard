import PropTypes from 'prop-types';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { Grid, Divider, Typography } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';

import { getRows, getColumns, getSettingsRows, settingsColumns, getUpdateSettings, getSelection } from './helpers';

const DataGrid = ({ data, settings, onChange, edit = false }) => {
    if (data.length === 0) {
        return (
            <MainCard>
                <Typography>Нет данных</Typography>
            </MainCard>
        );
    }

    if (edit) {
        return (
            <MainCard>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={7} style={{ paddingRight: 10 }}>
                            <Typography variant="h3">Предпросмотр</Typography>
                            <div style={{ height: 500, width: '100%' }}>
                                <MuiDataGrid rows={getRows(data)} columns={getColumns(data, settings)} />
                            </div>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid item xs style={{ paddingLeft: 10 }}>
                            <Typography variant="h3">Настройки</Typography>
                            <div style={{ height: 500, width: '100%' }}>
                                <MuiDataGrid
                                    disableSelectionOnClick
                                    rows={getSettingsRows(data, settings)}
                                    columns={settingsColumns}
                                    checkboxSelection
                                    selectionModel={getSelection(data, settings)}
                                    onSelectionModelChange={(selected) =>
                                        onChange && onChange({ ...settings, dataGridColumnSelection: selected })
                                    }
                                    onEditRowsModelChange={(newSettings) => onChange && onChange(getUpdateSettings(newSettings, settings))}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        );
    }

    return (
        <MainCard>
            <Grid item xs={12}>
                <div style={{ height: 500, width: '100%' }}>
                    <MuiDataGrid rows={getRows(data)} columns={getColumns(data, settings)} />
                </div>
            </Grid>
        </MainCard>
    );
};

DataGrid.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object,
    onChange: PropTypes.func,
    edit: PropTypes.bool
};

export default DataGrid;
