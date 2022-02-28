import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const LineChart = ({ options, series }) => <Chart options={options} series={series} type="line" height={350} />;

LineChart.propTypes = {
    options: PropTypes.object,
    series: PropTypes.arrayOf(PropTypes.object)
};

export default LineChart;
