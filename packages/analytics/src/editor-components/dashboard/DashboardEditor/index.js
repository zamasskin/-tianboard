import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import Editor, { useMonaco } from '@monaco-editor/react';
import _ from 'lodash';

import EmptyDashboard from './empty';
import ComponentSelector from './ComponentSelector';

import MainCard from 'ui-component/cards/MainCard';

import components from 'ui-component/DashboardComponents';

const DashboardEditor = ({ onChange, data, settings = { component: 'DataGrid' }, edit = false }) => {
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
    const componentName = _.has(components, component) ? component : 'DataGrid';
    const SelectComponent = components[componentName];
    return (
        <>
            <Grid item xs={12}>
                <SelectComponent data={data} settings={settings} onChange={onChange} edit={edit} />
            </Grid>
        </>
    );
};
DashboardEditor.propTypes = {
    data: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.object)]),
    settings: PropTypes.object,
    onChange: PropTypes.func,
    edit: PropTypes.bool
};

export default DashboardEditor;
