import $api from '../http';

class TaskService {
    static async loadActions() {
        return $api.get('/tasks/actions');
    }

    static async findMany(params) {
        return $api.post('/tasks/list', params);
    }

    static async findOne(id) {
        return $api.get(`/tasks/${id}`);
    }

    static async delete(id) {
        return $api.delete(`/tasks/${id}`);
    }

    static async action() {
        return $api.get('/tasks/methods');
    }

    static async create(createParams) {
        return $api.post('/tasks/create', createParams);
    }

    static async update(id, newTask) {
        return $api.put(`/tasks/${id}`, newTask);
    }
}

export default TaskService;
