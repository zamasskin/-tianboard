import { Grid, Box, Tabs, Tab, Typography, Stack } from '@mui/material';
import React from 'react';

import Form1 from './Form1';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const dataBases = [
    { label: 'Sqlite', id: 'Sqlite', title: 'Подключение к sqlite', component: <Form1 connectionType="sqlite" /> },
    { label: 'Mariadb', id: 'Mariadb', title: 'Подключение к Mariadb', component: <div>Mariadb</div> },
    { label: 'MySql', id: 'MySql', title: 'Подключение к MySql', component: <div>MySql</div> },
    { label: 'Postgresql', id: 'Postgresql', title: 'Подключение к Postgresql', component: <div>Postgresql</div> },
    { label: 'Mongodb', id: 'Mongodb', title: 'Подключение к Mongodb', component: <div>Mongodbdb</div> }
];

function TabPanel(props) {
    const { children, value, index, title, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item>
                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                    <Typography variant="h5">{title}</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    {children}
                </Box>
            )}
        </div>
    );
}

const CreateConnectionForm = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
                <Box>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable">
                            {dataBases.map((db, i) => (
                                <Tab key={i} label={db.label} {...a11yProps(i)} />
                            ))}
                        </Tabs>
                    </Box>
                    {dataBases.map((db, i) => (
                        <TabPanel key={i} value={value} index={i} title={db.title}>
                            {db.component}
                        </TabPanel>
                    ))}
                </Box>
            </Grid>
        </Grid>
    );
};

export default CreateConnectionForm;
