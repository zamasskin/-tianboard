import _ from 'lodash';
import { Grid } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';

const DataGrid = ({ data, settings }) => {
    const settingsName = getSettingsName('DataGrid');
    const keys = _.chain(data).head().keys().value();
    const defaultColumns = _.chain(data)
        .head()
        .keys()
        .map((field) => ({ field, headerName: field }))
        .value();
    const { columnsSettings = defaultColumns, selected = keys } = _.get(settings, settingsName) || {};

    const columns = columnsSettings.filter(({ field }) => selected.includes(field));

    const rows = data.map((item) => ({ ...item, id: item.id ? item.id : uuidv4() }));

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <div style={{ width: '100%', height: 500 }}>
                        <MuiDataGrid rows={rows} columns={columns} />
                    </div>
                </Grid>
            </Grid>
        </MainCard>
    );
};
DataGrid.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object
};

export default DataGrid;
