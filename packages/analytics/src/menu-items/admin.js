import { IconDatabase, IconUser } from '@tabler/icons';

const icons = { IconDatabase, IconUser };

const admin = {
    id: 'adminstration',
    title: 'Администрирование',
    type: 'group',
    children: [
        {
            id: 'admin-database',
            title: 'Подключения',
            type: 'item',
            url: '/admin/database',
            whichIncludes: true,
            icon: icons.IconDatabase,
            breadcrumbs: false
        },
        {
            id: 'admin-users',
            title: 'Пользователи',
            type: 'item',
            url: '/admin/admin-users',
            icon: icons.IconUser,
            breadcrumbs: false
        }
    ]
};

export default admin;
