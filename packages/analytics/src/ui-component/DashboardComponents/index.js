import YAML from 'yaml';

import DataGrid from './DataGrid';
import dataGridConfig from './DataGrid/config';
import BarChart from './BarChart';
import barChartConfig from './BarChart/config';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';

const components = {
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

export default components;
