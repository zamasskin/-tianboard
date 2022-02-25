import _ from 'lodash';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';

import MainCard from 'ui-component/cards/MainCard';
import { getConfig } from './config';

const BarChart = ({ data, settings }) => {
    const { series = {}, options = {}, error } = getConfig(settings, data);
    return (
        <MainCard>
            <Chart options={options} series={_.values(series)} type="bar" height={350} />
            {error && <Alert severity="error">{error}</Alert>}
        </MainCard>
    );
};

BarChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object
};

export default BarChart;
