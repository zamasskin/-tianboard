import axios from 'axios';
import { action, thunk, computed } from 'easy-peasy';

import config from 'config';

export default function appStore() {
    return {
        data: {
            connectionInstalled: false,
            userInstalled: false
        },
        installed: computed((state) => state.data.connectionInstalled && state.data.userInstalled),
        setConnectionInstalled: action((state, installed) => {
            state.data.connectionInstalled = installed;
        }),
        setUserInstalled: action((state, installed) => {
            state.data.userInstalled = installed;
        }),
        checkInstalled: thunk(async (actions) => {
            const response = await axios.get(`${config.apiUrl}/connections/bootstrap`, { withCredentials: true });
            actions.setConnectionInstalled(!!response.data.connectionInstalled);
            actions.setUserInstalled(!!response.data.userInstalled);
            localStorage.setItem('installed', response.data.connectionInstalled && response.data.userInstalled);
        })
    };
}
