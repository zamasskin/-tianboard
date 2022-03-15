import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStoreActions } from 'easy-peasy';
import { Alert, Typography } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import UserForm from 'ui-component/forms/Account/UserForm';
import AccountService from 'services/AccountService';

const UserEditContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    const [userSettings, setUserState] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const backPathStrLength = location.pathname.length - String(userId).length - 1;
    const backPath = location.pathname.substring(0, backPathStrLength);

    const loadUserSettings = async () => {
        if (userId) {
            try {
                setLoading(true);
                const response = await AccountService.detail(userId);
                setUserState(response.data);
            } catch (e) {
                setError(e?.response?.data?.message || e?.message || '');
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        loadUserSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmitUpdate = async (form, { setErrors, setSubmitting }) => {
        try {
            await AccountService.update(userId, form);
            navigate(backPath);
        } catch (e) {
            setErrors({ submit: e?.response?.data?.message || e.message });
        } finally {
            setSubmitting(false);
        }
        setSubmitting(false);
    };

    if (!userId) {
        return <Alert severity="error">Пользователь не найден</Alert>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return userSettings && <UserForm params={userSettings} cancelBtn onCancel={() => navigate(backPath)} onSubmit={onSubmitUpdate} />;
};

const UserEdit = () => {
    const { userId } = useParams();
    return (
        <MainCard>
            <Typography variant="h2">Редактирование пользователя №{userId}</Typography>
            <UserEditContent />
        </MainCard>
    );
};

export default UserEdit;
