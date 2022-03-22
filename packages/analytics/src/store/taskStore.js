import { action, thunk } from 'easy-peasy';
import TaskService from 'services/TaskService';

export default function taskStore() {
    return {
        data: {
            taskActions: []
        },
        setTaskActions: action((state, taskActions) => {
            state.data.taskActions = taskActions;
        }),
        loadTaskActions: thunk(async (actions) => {
            const response = await TaskService.loadActions();
            actions.setTaskActions(response.data);
            return response.data;
        })
    };
}
