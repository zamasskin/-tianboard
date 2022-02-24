import _ from 'lodash';
import { Grid } from '@mui/material';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

import { getRows } from './helpers';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';
import { defaultConfig } from './config';

const DataGrid = ({ data, settings }) => {
    const settingsName = getSettingsName('DataGrid');
    const componentSettings = _.has(settings, settingsName) ? settings[settingsName] : defaultConfig(data);

    const { width = '100%', height = 500, columns: configColumns, props = {} } = componentSettings;
    const columns = _.chain(configColumns)
        .map((settings, field) => ({ ...settings, field }))
        .value();

    return (
        <MainCard>
            <Grid item xs={12}>
                <div style={{ width, height }}>
                    <MuiDataGrid rows={getRows(data)} columns={columns} {...props} />
                </div>
            </Grid>
        </MainCard>
    );
};
DataGrid.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object
};

export default DataGrid;
