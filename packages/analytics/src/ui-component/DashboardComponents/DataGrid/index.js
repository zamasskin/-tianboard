import _ from 'lodash';
import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import YAML from 'yaml';

import MainCard from 'ui-component/cards/MainCard';
import { getRows } from './helpers';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';
import { defaultConfig } from './config';
import { gridSpacing } from 'store/constant';

const getSettings = (data, settings) => {
    try {
        const settingsName = getSettingsName('DataGrid');
        const componentSettings = _.has(settings, settingsName) ? YAML.parse(settings[settingsName]) : defaultConfig(data);

        const { width = '100%', height = 500, columns: configColumns, props = {} } = componentSettings;
        const columns = _.chain(configColumns)
            .map((settings, field) => ({ ...settings, field }))
            .value();
        const rows = getRows(data, componentSettings);
        return { width, height, props, columns, rows };
    } catch (error) {
        return { width: '100%', height: 500, props: {}, columns: [], rows: [], error };
    }
};

const DataGrid = ({ data, settings }) => {
    const { columns = [], rows = [], width = '100%', height = 500, props = {}, error } = getSettings(data, settings);

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <div style={{ width, height }}>
                        <MuiDataGrid rows={rows} columns={columns} {...props} />
                    </div>
                </Grid>
                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error">{error.message}</Alert>{' '}
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};
DataGrid.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object
};

export default DataGrid;
