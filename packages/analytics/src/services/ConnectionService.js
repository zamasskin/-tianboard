import axios from 'axios';
import $api from '../http';

import config from '../config';

class ConnectionService {
    static async bootstrap(params) {
        return axios.post(`${config.apiUrl}/connections/bootstrap`, params, { withCredentials: true });
    }

    static async bootstrapFile(params) {
        return axios.post(`${config.apiUrl}/connections/bootstrap/by-file`, params, { withCredentials: true });
    }

    static async bootstrapUrl(params) {
        return axios.post(`${config.apiUrl}/connections/bootstrap/by-url`, params, { withCredentials: true });
    }

    static async list() {
        return $api.get('/connections');
    }

    static async delete(id) {
        console.log(`/connections/${id}`);
        return $api.delete(`/connections/${id}`);
    }

    static async create(params) {
        return $api.post('/connections/create', params);
    }

    static async createFile(params) {
        return $api.post('/connections/create/by-file', params);
    }

    static async createUrl(params) {
        return $api.post('/connections/create/by-url', params);
    }

    static async findOne(contextName) {
        return $api.get(`/connections/connection/${contextName}`);
    }

    static async update(contextName, updateConfig) {
        return $api.put(`/connections/${contextName}`, updateConfig);
    }
}

export default ConnectionService;
