import * as icons from '@tabler/icons';

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
            url: '/admin/users',
            icon: icons.IconUser,
            breadcrumbs: false
        },
        {
            id: 'admin-task',
            title: 'Задачи',
            type: 'item',
            icon: icons.IconClipboard,
            url: '/admin/task',
            breadcrumbs: false
            // children: [
            //     {
            //         id: 'admin-task-list',
            //         title: 'Список',
            //         type: 'item',
            //         url: '/admin/task',
            //         breadcrumbs: false
            //     },
            //     {
            //         id: 'admin-task-list',
            //         title: 'Выполняющиеся',
            //         type: 'item',
            //         url: '/admin/task/items',
            //         breadcrumbs: false
            //     }
            // ]
        }
    ]
};

export default admin;
