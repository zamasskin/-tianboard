import _ from 'lodash';
import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import YAML from 'yaml';

import MainCard from 'ui-component/cards/MainCard';
import { getSettings, getRows } from './helpers';
import { gridSpacing } from 'store/constant';

const DataGrid = ({ data, settings }) => {
    const componentSettings = getSettings(data, settings);
    const { columns = [], width = '100%', height = 500, props = {}, error } = getSettings(data, settings);
    const rows = getRows(data, componentSettings);

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
