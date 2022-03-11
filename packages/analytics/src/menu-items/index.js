import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import admin from './admin';
import _ from 'lodash';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [dashboard, pages, utilities, other]
};

export function createNavigation(roles = ['user']) {
    if (_.isArray(roles) && _.includes(roles, 'admin')) {
        return {
            items: [dashboard, pages, utilities, admin, other]
        };
    }
    return menuItems;
}

export default menuItems;
