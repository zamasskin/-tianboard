import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import _ from 'lodash';

import DataGrid from './DataGrid/DataGridSettings';
import ApexChart from './ApexChart/ApexChartSettings';

const components = {
    DataGrid,
    ApexChart
};

const Settings = ({ onChange, data, settings = { component: 'DataGrid' } }) => {
    const { component } = settings;

    if (!Array.isArray(data)) {
        return false;
    }

    if (data.length === 0) {
        return false;
    }

    if (!_.has(components, component)) {
        return <Alert severity="warning">Компонент не найден</Alert>;
    }

    try {
        const componentName = _.has(components, component) ? component : 'DataGrid';
        const SelectComponent = components[componentName];

        return <SelectComponent data={data} settings={settings} onChange={onChange} />;
    } catch (err) {
        console.error(err);
        return <Alert severity="error">{err.message}</Alert>;
    }
};

Settings.propTypes = {
    data: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.object)]),
    settings: PropTypes.object,
    onChange: PropTypes.func
};

export default Settings;
