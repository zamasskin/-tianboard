import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const CreateDatabase = Loadable(lazy(() => import('views/Bootstrap/CreateDatabase')));
const CreateUser = Loadable(lazy(() => import('views/Bootstrap/CreateUser')));

const BootstrapRouter = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/bootstrap/database',
            element: <CreateDatabase />
        },
        {
            path: '/bootstrap/user',
            element: <CreateUser />
        }
    ]
};

export default BootstrapRouter;
