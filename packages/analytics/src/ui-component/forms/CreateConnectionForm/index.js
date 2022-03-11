import React from 'react';
import { Grid, Box, Tabs, Tab, Typography, Stack } from '@mui/material';
import PropTypes from 'prop-types';

import FromConnection1 from './FromConnection1';
import FromConnection2 from './FromConnection2';
import FromConnection3 from './FromConnection3';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

function a12yProps(index) {
    return {
        id: `simple-child-tab-${index}`,
        'aria-controls': `simple-child-tabpanel-${index}`
    };
}

function PostgresqlForm(props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable">
                    <Tab label="Через форму" {...a12yProps(0)} />
                    <Tab label="Через URL" {...a12yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <FromConnection2 connectionType="postgresql" defaultPort="5432" {...props} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <FromConnection3
                    connectionType="postgresql"
                    placeholder="postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]"
                    {...props}
                />
            </TabPanel>
        </div>
    );
}

const dataBases = [
    {
        label: 'Sqlite',
        id: 'Sqlite',
        title: 'Подключение к sqlite',
        component: (props) => <FromConnection1 connectionType="sqlite" {...props} />
    },
    {
        label: 'Mariadb',
        id: 'Mariadb',
        title: 'Подключение к Mariadb',
        component: (props) => <FromConnection2 connectionType="mariadb" defaultPort="3306" {...props} />
    },
    {
        label: 'MySql',
        id: 'MySql',
        title: 'Подключение к MySql',
        component: (props) => <FromConnection2 connectionType="mysql" defaultPort="3306" {...props} />
    },
    {
        label: 'Postgresql',
        id: 'Postgresql',
        title: 'Подключение к Postgresql',
        component: (props) => <PostgresqlForm {...props} />
    },
    {
        label: 'Mongodb',
        id: 'Mongodb',
        title: 'Подключение к Mongodb',
        component: (props) => <FromConnection3 connectionType="mongo" placeholder="mongodb://localhost:27017/admin" {...props} />
    }
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

TabPanel.propTypes = {
    children: PropTypes.element,
    value: PropTypes.number,
    index: PropTypes.number,
    title: PropTypes.string
};

const CreateConnectionForm = ({ onSubmit }) => {
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
                            {React.createElement(db.component, { onSubmit })}
                        </TabPanel>
                    ))}
                </Box>
            </Grid>
        </Grid>
    );
};

CreateConnectionForm.propTypes = {
    onSubmit: PropTypes.func
};

export default CreateConnectionForm;
