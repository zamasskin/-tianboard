import $api from 'http';

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
}

export default AccountService;
