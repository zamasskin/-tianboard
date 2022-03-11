import { createStore } from 'easy-peasy';
import themeStore from './themeStore';
import accountStore from './accountStore';
import appStore from './appStore';

const store = createStore({
    app: appStore(),
    theme: themeStore(),
    account: accountStore()
});

export default store;
