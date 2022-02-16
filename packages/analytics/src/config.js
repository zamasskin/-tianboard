const apiHost = process.env.REACT_APP_API_HOST || 'http://localhost';
const apiPort = process.env.REACT_APP_API_PORT || 8083;
const apiPath = process.env.API_PATH || '/api';

const config = {
    basename: '/',
    defaultPath: '/dashboard/default',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12,
    apiUrl: new URL(apiPath, [apiHost, apiPort].join(':'))
};

export default config;
