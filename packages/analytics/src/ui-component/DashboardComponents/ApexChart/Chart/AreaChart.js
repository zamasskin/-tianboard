import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const AreaChart = ({ options, series }) => <Chart options={options} series={series} type="area" height={350} />;

AreaChart.propTypes = {
    options: PropTypes.object,
    series: PropTypes.arrayOf(PropTypes.object)
};

export default AreaChart;
