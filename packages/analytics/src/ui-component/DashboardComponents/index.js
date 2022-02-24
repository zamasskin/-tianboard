import YAML from 'yaml';

import DataGrid from './DataGrid';
import dataGridConfig from './DataGrid/config';
import BarChart from './BarChart';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';

const components = {
    DataGrid,
    BarChart
};

export const defaultConfig = {
    DataGrid: (data) => dataGridConfig(data), // dataGridConfig(data),
    BarChart: () => ''
};

export const getSettings = (settings, data, isJson = false) => {
    const componentName = settings.component;
    const settingsName = getSettingsName(componentName);
    if (settings[settingsName]) {
        return isJson ? settings[settingsName] : YAML.stringify(settings[settingsName]);
    }
    return isJson ? YAML.parse(defaultConfig[componentName](data)) : defaultConfig[componentName](data);
};

export default components;
