// material-ui
import { Typography } from '@mui/material';
import { useStoreState } from 'easy-peasy';

// project imports
import NavGroup from './NavGroup';
import { createNavigation } from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const user = useStoreState((state) => state.account.data.user);
    const menuItem = createNavigation(user.roles);
    const navItems = menuItem.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
