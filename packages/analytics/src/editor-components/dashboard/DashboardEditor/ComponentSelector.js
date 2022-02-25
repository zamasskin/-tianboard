import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { components as DashboardComponents } from 'ui-component/DashboardComponents';

const components = Object.keys(DashboardComponents);

const ComponentSelector = ({ value = 'DataGrid', onChange }) => (
    <Grid item xs={12}>
        <Grid container wrap="nowrap" spacing={8} sx={{ overflow: 'auto' }}>
            <Grid item>
                <Select onChange={onChange} value={value}>
                    {components.map((component) => (
                        <MenuItem value={component} key={component}>
                            {component}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Grid>
    </Grid>
);

ComponentSelector.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default ComponentSelector;
