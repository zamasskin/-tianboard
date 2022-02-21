import { Grid } from '@mui/material';

import QueryEditor from 'editor-components/dashboard/QueryEditor';
import DashboardEditor from 'editor-components/dashboard/DashboardEditor';

import { gridSpacing } from 'store/constant';
import { useState } from 'react';

function DashboardEdit() {
    const [data, setData] = useState([{ id: 1, name: 'test' }]);
    const [settings, setSettings] = useState({ component: 'DataGrid' });

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid item>
                    <QueryEditor onResult={(data) => setData(data)} />
                </Grid>
            </Grid>
            <DashboardEditor data={data} settings={settings} edit onChange={(settings) => setSettings(settings)} />
        </Grid>
    );
}

export default DashboardEdit;
