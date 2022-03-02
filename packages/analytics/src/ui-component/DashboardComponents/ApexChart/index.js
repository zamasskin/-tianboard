import _ from 'lodash';
// import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';

import MainCard from 'ui-component/cards/MainCard';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';
import Chart from './Chart';

// import { getConfig } from './config';
import createStorage from './storage';

const ApexChart = ({ data, settings }) => {
    const settingsName = getSettingsName('ApexChart');
    const jsonSettings = _.has(settings, settingsName) ? settings[settingsName] : {};
    const storage = createStorage(jsonSettings);
    const { series = {}, options = {}, type = 'bar', error } = storage.$values(data);

    return (
        <MainCard>
            <Chart options={options} series={_.values(series)} type={type} />
            {error && <Alert severity="error">{error}</Alert>}
        </MainCard>
    );
};

ApexChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object
};

export default ApexChart;
