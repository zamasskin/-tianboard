import { createStore } from 'easy-peasy';
import themeStore from './themeStore';
import accountStore from './accountStore';

const store = createStore({
    theme: {
        ...themeStore()
    },
    account: {
        ...accountStore()
    }
});

export default store;
