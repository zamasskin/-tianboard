import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

const BarChartSettings = ({ data, settings, onChange }) => (
    <Grid container>
        <Grid item xs>
            BarChartSettings
        </Grid>
    </Grid>
);

BarChartSettings.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object,
    onChange: PropTypes.func
};

export default BarChartSettings;
