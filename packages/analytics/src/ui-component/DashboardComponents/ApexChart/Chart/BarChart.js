import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const BarChart = ({ options, series }) => <Chart options={options} series={series} type="bar" height={350} />;

BarChart.propTypes = {
    options: PropTypes.object,
    series: PropTypes.arrayOf(PropTypes.object)
};

export default BarChart;
