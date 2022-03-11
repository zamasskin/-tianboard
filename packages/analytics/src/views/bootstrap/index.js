import { useStoreState } from 'easy-peasy';
import CreateDatabase from './CreateDatabase';
import CreateUser from './CreateUser';

const Bootstrap = () => {
    const appStore = useStoreState((state) => state.app.data);
    if (!appStore.connectionInstalled) {
        return <CreateDatabase />;
    }
    return <CreateUser />;
};

export default Bootstrap;
