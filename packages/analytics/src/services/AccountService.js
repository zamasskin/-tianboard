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

    static async delete(id) {
        return $api.delete(`/account/${id}`);
    }

    static async detail(id) {
        return $api.get(`/account/detail/${id}`);
    }

    static async update(id, updateParams) {
        return $api.put(`/account/${id}`, updateParams);
    }

    static async forgot(email) {
        return axios.post(`${config.apiUrl}/account/forgot`, { email });
    }

    static async restore(uuid, email, password) {
        return axios.put(`${config.apiUrl}/account/restore-password/${uuid}`, { email, password });
    }
}

export default AccountService;
