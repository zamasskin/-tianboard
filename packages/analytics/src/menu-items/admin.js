import { IconDatabase, IconUser } from '@tabler/icons';

const icons = { IconDatabase, IconUser };

const admin = {
    id: 'admin',
    title: 'Администрирование',
    type: 'group',
    children: [
        {
            id: 'admin-database',
            title: 'Подключения',
            type: 'item',
            url: '/admin/database',
            icon: icons.IconDatabase,
            breadcrumbs: false
        },
        {
            id: 'admin-admin',
            title: 'Пользователи',
            type: 'item',
            url: '/admin/users',
            icon: icons.IconUser,
            breadcrumbs: false
        }
    ]
};

export default admin;
