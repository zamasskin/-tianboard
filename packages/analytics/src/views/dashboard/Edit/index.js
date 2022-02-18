import { Grid } from '@mui/material';

import QueryEditor from 'editor-components/dashboard/QueryEditor';
import DashboardEditor from 'editor-components/dashboard/DashboardEditor';

import { gridSpacing } from 'store/constant';
import { useState } from 'react';

function DashboardEdit() {
    const [data, setData] = useState(false);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid item>
                    <QueryEditor onResult={(data) => setData(data)} />
                </Grid>
            </Grid>
            {data && (
                <Grid item xs={12}>
                    <DashboardEditor data={data} />
                </Grid>
            )}
        </Grid>
    );
}

export default DashboardEdit;
