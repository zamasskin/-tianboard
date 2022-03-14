import { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useStoreActions } from 'easy-peasy';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';

import ConnectionService from 'services/ConnectionService';
import FormSelector from 'ui-component/forms/CreateConnectionForm/FormSelector';

const DatabaseEditContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const checkAuth = useStoreActions((actions) => actions.account.checkAuth);
    const { databaseId } = useParams();
    const [load, setLoad] = useState(false);
    const [params, setParams] = useState(false);
    const [error, setError] = useState(false);

    const loadConfiguration = async () => {
        if (databaseId) {
            setLoad(true);
            try {
                await checkAuth();
                const response = await ConnectionService.findOne(databaseId);
                setParams(response.data);
            } catch (e) {
                setError(e?.response?.data?.message || e.message);
            } finally {
                setLoad(false);
            }
        }
    };

    useEffect(() => {
        loadConfiguration();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!databaseId) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (databaseId === 'default') {
        return <Alert severity="error">Нельзя редактировать предустановленную базу данных</Alert>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (load) {
        return <div>Loading...</div>;
    }

    const backPathStrLength = location.pathname.length - String(databaseId).length - 1;
    const backPath = location.pathname.substring(0, backPathStrLength);

    const onSubmitUpdate = async (form, { setErrors, setSubmitting }) => {
        try {
            await checkAuth();
            await ConnectionService.update(databaseId, form);
            navigate(backPath);
        } catch (e) {
            setErrors({ submit: e?.response?.data?.message || e.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        params && (
            <FormSelector submitName="Сохранить" cancelBtn params={params} onCancel={() => navigate(backPath)} onSubmit={onSubmitUpdate} />
        )
    );
};

const DatabaseEdit = () => (
    <MainCard>
        <DatabaseEditContent />
    </MainCard>
);

export default DatabaseEdit;
