import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';
import TaskService from 'services/TaskService';
import EditTask from 'ui-component/forms/EditTask';

const EditContent = ({ taskId }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params, setParams] = useState({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const backPathStrLength = location.pathname.length - String(taskId).length - 1;
    const backPath = location.pathname.substring(0, backPathStrLength);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await TaskService.findOne(taskId);
            setParams(response.data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        if (taskId) {
            loadData();
        }
    }, []);

    const onSubmit = async (form, { setErrors, setSubmitting }) => {
        try {
            await TaskService.update(taskId, form);
            navigate(backPath);
        } catch (e) {
            setErrors({ submit: e?.response?.data?.message || e.message });
        } finally {
            setSubmitting(false);
        }
    };

    if (!taskId) {
        return <Alert severity="error">Задача не найдена</Alert>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return <EditTask onSubmit={onSubmit} onCancel={() => navigate(backPath)} values={params} />;
};

EditContent.propTypes = {
    taskId: PropTypes.number
};

const Edit = () => {
    const { taskId } = useParams();
    const title = `Редактирование задачи №${taskId}`;
    return (
        <MainCard title={title}>
            <EditContent taskId={Number(taskId)} />
        </MainCard>
    );
};

export default Edit;
