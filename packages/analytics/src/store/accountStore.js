import axios from 'axios';
import { action, thunk } from 'easy-peasy';
import AccountService from 'services/AccountService';

import config from 'config';

export default function accountStore() {
    return {
        data: {
            isAuth: false,
            user: false
        },
        setAuth: action((state, auth) => {
            state.data.isAuth = auth;
        }),
        setUser: action((state, user) => {
            state.data.user = user;
        }),
        login: thunk(async (actions, payload) => {
            const { email, password } = payload;
            const response = await AccountService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            actions.setAuth(true);
            actions.setUser(response.data.user);
            return response.data;
        }),
        logout: thunk(async (actions) => {
            try {
                await AccountService.logout();
                localStorage.removeItem('token');
                actions.setAuth(false);
                actions.setUser(false);
            } catch (e) {
                console.log(e);
            }
        }),
        bootstrap: thunk(async (actions, payload) => {
            const response = await AccountService.bootstrap(payload);
            localStorage.setItem('token', response.data.accessToken);
            actions.setAuth(true);
            actions.setUser(response.data.user);
            return response.data;
        }),
        refresh: thunk(async (actions) => {
            try {
                const response = await AccountService.refresh();
                localStorage.setItem('token', response.data.accessToken);
                actions.setAuth(true);
                actions.setUser(response.data.user);
            } catch (e) {
                console.log(e);
                console.log(e?.response?.data);
            }
        }),
        checkAuth: thunk(async (actions) => {
            try {
                const response = await axios.get(`${config.apiUrl}/account/refresh`, { withCredentials: true });
                localStorage.setItem('token', response.data.accessToken);
                actions.setAuth(true);
                actions.setUser(response.data.user);
                return true;
            } catch (e) {
                console.log(e?.response?.data);
                return false;
            }
        })
    };
}
