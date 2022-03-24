import { useNavigate, useLocation } from 'react-router-dom';
import TaskService from 'services/TaskService';

import MainCard from 'ui-component/cards/MainCard';
import EditTask from 'ui-component/forms/EditTask';

const New = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const backPathStrLength = location.pathname.length - 'new'.length - 1;
    const backPath = location.pathname.substring(0, backPathStrLength);

    const onSubmit = async (form, { setErrors, setSubmitting }) => {
        try {
            await TaskService.create(form);
            navigate(backPath);
        } catch (e) {
            setErrors({ submit: e?.response?.data?.message || e.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainCard title="Создание новой задачи">
            <EditTask onSubmit={onSubmit} onCancel={() => navigate(backPath)} />
        </MainCard>
    );
};

export default New;
