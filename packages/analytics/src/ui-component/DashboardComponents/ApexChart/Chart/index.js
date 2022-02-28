import PropTypes from 'prop-types';
import _ from 'lodash';

import BarChart from './BarChart';
import AreaChart from './AreaChart';
import LineChart from './LineChart';

const components = {
    bar: BarChart,
    area: AreaChart,
    line: LineChart
};

const Chart = ({ options, series, type = 'bar' }) => {
    const ComponentChart = _.has(components, type) ? _.get(components, type) : components.bar;
    return <ComponentChart options={options} series={series} />;
};

Chart.propTypes = {
    options: PropTypes.object,
    series: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string
};

export default Chart;
