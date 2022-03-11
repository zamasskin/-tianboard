import axios from 'axios';

import config from '../config';

class ConnectionService {
    static async bootstrap(params) {
        return axios.post(`${config.apiUrl}/connections/bootstrap`, params, { withCredentials: true });
    }

    static async bootstrapFile(params) {
        return axios.post(`${config.apiUrl}/connections/bootstrap/by-file`, params, { withCredentials: true });
    }

    static bootstrapUrl(params) {
        return axios.post(`${config.apiUrl}/connections/bootstrap/by-url`, params, { withCredentials: true });
    }
}

export default ConnectionService;
