import axios from 'axios';
import { action, thunk, computed } from 'easy-peasy';

import config from 'config';
import ConnectionService from 'services/ConnectionService';

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
        }),
        bootstrap: thunk(async (action, payload) => {
            const { formType, ...params } = payload;
            if (formType === 'file') {
                await ConnectionService.bootstrapFile(params);
            } else if (formType === 'url') {
                await ConnectionService.bootstrapUrl(params);
            } else {
                await ConnectionService.bootstrap(params);
            }
            action.setConnectionInstalled(true);
        })
    };
}
