import { lazy, useState, useEffect } from 'react';
import { Routes, Route, Redirect } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardEdit = Loadable(lazy(() => import('views/dashboard/Edit')));

const PrivateRoute = ({ isLoggedIn, ...props }) => (isLoggedIn ? <Route {...props} /> : <div>login</div>);

const Router = () => {
    const checkAuth = useStoreActions((actions) => actions.account.checkAuth);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        (async () => {
            console.log(1);
            setLoad(true);
            if (localStorage.getItem('token')) {
                await checkAuth();
            }
            setLoad(false);
        })();
    }, []);

    if (load) {
        return <div>load...</div>;
    }

    return (
        <Routes>
            <MainLayout>
                <Route path="/" element={<DashboardDefault />} />
                <Route path="/dashboard/edit" element={<DashboardEdit />} />
            </MainLayout>
        </Routes>
    );
};

export default Router;
