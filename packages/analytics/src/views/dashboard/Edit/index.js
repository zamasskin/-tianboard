import { Grid } from '@mui/material';

import QueryEditor from 'editor-components/dashboard/QueryEditor';
import ComponentSelector from 'editor-components/dashboard/DashboardEditor/ComponentSelector';
import Dashboard from 'ui-component/DashboardComponents';

import { gridSpacing } from 'store/constant';
import { useState } from 'react';
import SettingsEdit from 'editor-components/dashboard/DashboardEditor/SettingsEdit';

function DashboardEdit() {
    const defaultSettings = { component: 'DataGrid' };
    const [data, setData] = useState([
        {
            id: 1,
            name: 'example',
            description:
                'Consequat non nostrud velit culpa consectetur sunt occaecat nulla ullamco culpa cillum labore enim proident. Tempor deserunt irure adipisicing nulla ut cillum adipisicing id fugiat incididunt adipisicing dolore. Aliqua deserunt excepteur tempor esse eu cillum velit est duis reprehenderit culpa. Eu enim voluptate est occaecat ullamco cillum amet aliquip consectetur amet. Reprehenderit quis ex dolor qui sint officia dolor veniam incididunt pariatur veniam incididunt. Ut deserunt sit nostrud do sunt do consequat do id duis excepteur quis eiusmod veniam.',
            price: 100,
            quantity: 2
        },
        {
            id: 2,
            name: 'example',
            description:
                'Consequat non nostrud velit culpa consectetur sunt occaecat nulla ullamco culpa cillum labore enim proident. Tempor deserunt irure adipisicing nulla ut cillum adipisicing id fugiat incididunt adipisicing dolore. Aliqua deserunt excepteur tempor esse eu cillum velit est duis reprehenderit culpa. Eu enim voluptate est occaecat ullamco cillum amet aliquip consectetur amet. Reprehenderit quis ex dolor qui sint officia dolor veniam incididunt pariatur veniam incididunt. Ut deserunt sit nostrud do sunt do consequat do id duis excepteur quis eiusmod veniam.',
            price: 300,
            quantity: 1
        },
        {
            id: 3,
            name: 'example',
            description:
                'Consequat non nostrud velit culpa consectetur sunt occaecat nulla ullamco culpa cillum labore enim proident. Tempor deserunt irure adipisicing nulla ut cillum adipisicing id fugiat incididunt adipisicing dolore. Aliqua deserunt excepteur tempor esse eu cillum velit est duis reprehenderit culpa. Eu enim voluptate est occaecat ullamco cillum amet aliquip consectetur amet. Reprehenderit quis ex dolor qui sint officia dolor veniam incididunt pariatur veniam incididunt. Ut deserunt sit nostrud do sunt do consequat do id duis excepteur quis eiusmod veniam.',
            price: 200,
            quantity: 1
        },
        {
            id: 4,
            name: 'example',
            description:
                'Consequat non nostrud velit culpa consectetur sunt occaecat nulla ullamco culpa cillum labore enim proident. Tempor deserunt irure adipisicing nulla ut cillum adipisicing id fugiat incididunt adipisicing dolore. Aliqua deserunt excepteur tempor esse eu cillum velit est duis reprehenderit culpa. Eu enim voluptate est occaecat ullamco cillum amet aliquip consectetur amet. Reprehenderit quis ex dolor qui sint officia dolor veniam incididunt pariatur veniam incididunt. Ut deserunt sit nostrud do sunt do consequat do id duis excepteur quis eiusmod veniam.',
            price: 500,
            quantity: 1
        }
    ]);
    const [settings, setSettings] = useState(defaultSettings);

    const onResult = (data) => {
        setSettings(defaultSettings);
        setData(data);
    };

    let timeout = false;
    const onChangeSettings = (settings) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => setSettings(settings), 1000);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid item>
                    <QueryEditor onResult={onResult} />
                </Grid>
            </Grid>
            {data && (
                <>
                    <ComponentSelector
                        value={settings.component}
                        onChange={({ target: { value } }) => setSettings({ ...settings, component: value })}
                    />
                    <Grid item xs={12}>
                        <Dashboard data={data} settings={settings} edit onChange={(settings) => setSettings(settings)} />
                    </Grid>

                    <SettingsEdit data={data} settings={settings} onChange={onChangeSettings} />
                </>
            )}
        </Grid>
    );
}

export default DashboardEdit;
