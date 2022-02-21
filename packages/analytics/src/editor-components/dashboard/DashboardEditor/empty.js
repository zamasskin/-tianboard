import Alert from '@mui/material/Alert';

import MainCard from 'ui-component/cards/MainCard';

const EmptyDashboard = () => (
    <MainCard>
        <Alert severity="warning">Данные для построение графиков отсутствуют</Alert>
    </MainCard>
);

export default EmptyDashboard;
