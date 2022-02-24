import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import ToggleButtonMui from '@mui/material/ToggleButton';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import DashboardComponents from './DashboardComponents';

const components = Object.keys(DashboardComponents);

const ComponentSelector = ({ value = 'DataGrid', onChange }) => (
    <Grid item xs={12}>
        <Grid container wrap="nowrap" spacing={8} sx={{ overflow: 'auto' }}>
            <Grid item>
                <Select onChange={onChange} defaultValue={value}>
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

export default ComponentSelector;
