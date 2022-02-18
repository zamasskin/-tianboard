import PropTypes from 'prop-types';
import _ from 'lodash';

import DataGrid from './DashboardComponents/DataGrid';

const components = {
    DataGrid
};

const DashboardEditor = ({ data = [], component = 'DataGrid', settings = {} }) => {
    const componentName = _.has(components, component) ? component : 'DataGrid';
    const SelectComponent = components[componentName];
    return <SelectComponent data={data} settings={settings} />;
};
DashboardEditor.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    component: PropTypes.string,
    settings: PropTypes.object
};

export default DashboardEditor;
