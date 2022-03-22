import $api from '../http';

class TaskService {
    static async loadActions() {
        return $api.get('/tasks/actions');
    }

    static findMany(params) {
        return $api.post('/tasks/list', params);
    }

    static delete(id) {
        return $api.delete(`/tasks/${id}`);
    }
}

export default TaskService;
