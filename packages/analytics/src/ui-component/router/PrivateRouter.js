import { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

function PrivateRouter(props) {
    const checkAuth = useStoreActions((actions) => actions.account.checkAuth);
    const account = useStoreState((state) => state.account);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        (async () => {
            setLoad(true);
            if (localStorage.getItem('token')) {
                await checkAuth();
            }
            setLoad(false);
        })();
    }, []);

    if (load) {
        return <div>load</div>;
    }

    return <div>1</div>;
}

PrivateRouter.propTypes = {};

export default PrivateRouter;
