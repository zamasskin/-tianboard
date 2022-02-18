import PropTypes from 'prop-types';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { Grid, Divider, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import MainCard from 'ui-component/cards/MainCard';

const DataGrid = ({ data, settings }) => {
    const keys = Object.keys(_.first(data));
    const rows = data.map((items) => ({ ...items, id: items.id || uuidv4() }));

    const columns = keys.map((key) => ({
        field: key,
        headerName: key,
        ...((settings?.columnsSetting && settings?.columnsSetting[key]) || {})
    }));

    return (
        <>
            <MainCard>
                <div style={{ height: 500, width: '100%' }}>
                    <MuiDataGrid rows={rows} columns={columns} />
                </div>
            </MainCard>
            <MainCard>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={8} style={{ paddingRight: 10 }}>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo. Nulla ut facilisis
                                ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed malesuada lobortis pretium.
                            </Typography>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid item xs style={{ paddingLeft: 10 }}>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo. Nulla ut facilisis
                                ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed malesuada lobortis pretium
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

DataGrid.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object
};

export default DataGrid;
