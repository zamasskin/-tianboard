import { createStore } from 'easy-peasy';
import themeStore from './themeStore';
import accountStore from './accountStore';
import appStore from './appStore';
import taskStore from './taskStore';

const store = createStore({
    app: appStore(),
    theme: themeStore(),
    account: accountStore(),
    task: taskStore()
});

export default store;
