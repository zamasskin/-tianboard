import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import YAML from 'yaml';
import _ from 'lodash';

import DataGrid from './DataGrid';
import dataGridConfig from './DataGrid/config';
import BarChart from './BarChart';
import barChartConfig from './BarChart/config';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';
import EmptyDashboard from './empty';

export const components = {
    DataGrid,
    BarChart
};

export const defaultConfig = {
    DataGrid: (data) => dataGridConfig(data), // dataGridConfig(data),
    BarChart: (data) => barChartConfig(data)
};

export const getSettings = (settings, data, isJson = false) => {
    const componentName = settings.component;
    const settingsName = getSettingsName(componentName);
    if (settings[settingsName]) {
        return isJson ? YAML.parse(settings[settingsName]) : settings[settingsName];
    }
    return isJson ? YAML.parse(defaultConfig[componentName](data)) : defaultConfig[componentName](data);
};

const Dashboard = ({ onChange, data, settings = { component: 'DataGrid' }, edit = false }) => {
    const { component } = settings;
    if (!Array.isArray(data)) {
        return false;
    }

    if (edit && data.length === 0) {
        return (
            <Grid item xs={12}>
                <EmptyDashboard />
            </Grid>
        );
    }

    if (!_.has(components, component)) {
        return <Alert severity="warning">Компонент не найден</Alert>;
    }

    const componentName = _.has(components, component) ? component : 'DataGrid';
    const SelectComponent = components[componentName];
    return <SelectComponent data={data} settings={settings} onChange={onChange} edit={edit} />;
};

Dashboard.propTypes = {
    data: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.object)]),
    settings: PropTypes.object,
    onChange: PropTypes.func,
    edit: PropTypes.bool
};

export default Dashboard;
