import { createStore } from 'easy-peasy';
import createTheme from './theme';

const store = createStore({
    theme: {
        ...createTheme()
    }
});

export default store;
