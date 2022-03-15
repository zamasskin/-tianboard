import axios from 'axios';
import $api from '../http';

import config from '../config';

class AccountService {
    static async login(email, password) {
        return $api.post('/account/login', { email, password });
    }

    static async logout() {
        return $api.get('/account/logout');
    }

    static async refresh() {
        return $api.get('/account/refresh');
    }

    static async bootstrap(account) {
        return $api.post('/account/bootstrap', account);
    }

    static async create(account) {
        return $api.post('/account/create', account);
    }

    static async findMany(params) {
        return $api.post('/account/list', params);
    }

    static async roles() {
        return axios.get(`${config.apiUrl}/account/roles`);
    }
}

export default AccountService;
