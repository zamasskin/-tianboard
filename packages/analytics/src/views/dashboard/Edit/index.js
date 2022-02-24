import { Grid } from '@mui/material';

import QueryEditor from 'editor-components/dashboard/QueryEditor';
import DashboardEditor from 'editor-components/dashboard/DashboardEditor';
import ComponentSelector from 'editor-components/dashboard/DashboardEditor/ComponentSelector';

import { gridSpacing } from 'store/constant';
import { useState } from 'react';
import SettingsEdit from 'editor-components/dashboard/DashboardEditor/SettingsEdit';

function DashboardEdit() {
    const [data, setData] = useState([
        {
            id: 1,
            name: 'example',
            description:
                'Consequat non nostrud velit culpa consectetur sunt occaecat nulla ullamco culpa cillum labore enim proident. Tempor deserunt irure adipisicing nulla ut cillum adipisicing id fugiat incididunt adipisicing dolore. Aliqua deserunt excepteur tempor esse eu cillum velit est duis reprehenderit culpa. Eu enim voluptate est occaecat ullamco cillum amet aliquip consectetur amet. Reprehenderit quis ex dolor qui sint officia dolor veniam incididunt pariatur veniam incididunt. Ut deserunt sit nostrud do sunt do consequat do id duis excepteur quis eiusmod veniam.',
            price: 100,
            quantity: 2
        }
    ]);
    const [settings, setSettings] = useState({ component: 'DataGrid' });

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid item>
                    <QueryEditor onResult={(data) => setData(data)} />
                </Grid>
            </Grid>
            {data && (
                <>
                    <ComponentSelector
                        value={settings.component}
                        onChange={({ target: { value } }) => setSettings({ ...settings, component: value })}
                    />
                    <DashboardEditor data={data} settings={settings} edit onChange={(settings) => setSettings(settings)} />
                    <SettingsEdit data={data} settings={settings} onChange={(settings) => setSettings(settings)} />
                </>
            )}
        </Grid>
    );
}

export default DashboardEdit;
