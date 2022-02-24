import _ from 'lodash';
import { Grid } from '@mui/material';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';

import { getRows, getColumns } from './helpers';
// import { getSettingsName } from '..';
import config from './config';

const DataGrid = ({ data, settings }) => {
    const settingsName = 'DataGridSettings';
    const componentSettings = _.has(settings, settingsName) ? settings[settingsName] : {};

    return (
        <MainCard>
            <Grid item xs={12}>
                <div style={{ height: 500, width: '100%' }}>
                    1234
                    {/* <MuiDataGrid rows={getRows(data)} columns={getColumns(data, settings)} /> */}
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
