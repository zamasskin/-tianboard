import { lazy, useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import Loadable from 'ui-component/Loadable';

// layouts
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';

import Login from 'views/auth/Login';

import Bootstrap from 'views/Bootstrap';

// account
const Settings = Loadable(lazy(() => import('views/account/Settings')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardEdit = Loadable(lazy(() => import('views/dashboard/Edit')));

// ==============================|| APP ||============================== //

const PrivateOutlet = () => {
    const isAuth = useStoreState((state) => state.account.data.isAuth);
    const location = useLocation();
    return isAuth ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

const AppContent = () => {
    const [load, setLoad] = useState(true);
    const checkInstalled = useStoreActions((actions) => actions.app.checkInstalled);
    const checkAuth = useStoreActions((actions) => actions.account.checkAuth);
    const installed = useStoreState((state) => state.app.installed);

    useEffect(() => {
        setLoad(true);
        Promise.all([checkInstalled(), checkAuth()]).finally(() => setLoad(false));
    }, [checkInstalled, checkAuth]);

    if (load) {
        return <div>load...</div>;
    }

    if (!installed) {
        return (
            <Routes>
                <Route path="*" element={<MinimalLayout />}>
                    <Route path="*" element={<Bootstrap />} />
                </Route>
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<PrivateOutlet />}>
                    <Route path="/" element={<DashboardDefault />} />
                    <Route path="/dashboard/default" element={<DashboardDefault />} />
                    <Route path="/dashboard/edit" element={<DashboardEdit />} />
                    <Route path="/utils/util-typography" element={<UtilsTypography />} />
                    <Route path="/utils/util-color" element={<UtilsColor />} />
                    <Route path="/utils/util-shadow" element={<UtilsShadow />} />
                    <Route path="/icons/tabler-icons" element={<UtilsMaterialIcons />} />
                    <Route path="/icons/material-icons" element={<UtilsTablerIcons />} />
                    <Route path="/account/settings" element={<Settings />} />
                </Route>
            </Route>
            <Route path="/login" element={<MinimalLayout />}>
                <Route path="/" element={<Login />} />
                <Navigate to="/" />
            </Route>
        </Routes>
    );
};

const App = () => {
    const customization = useStoreState((state) => state.theme.data);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <AppContent />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
