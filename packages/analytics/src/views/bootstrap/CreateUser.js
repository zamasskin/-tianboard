import { Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStoreActions } from 'easy-peasy';

import AuthCardWrapper from 'views/pages/authentication/AuthCardWrapper';
import AuthWrapper1 from 'views/pages/authentication/AuthWrapper1';
import Logo from 'ui-component/Logo';
import CreateUserForm from 'ui-component/forms/Account/RegistrationForm';

const CreateUser = () => {
    const createUser = useStoreActions((actions) => actions.account.bootstrap);
    const setUserInstalled = useStoreActions((actions) => actions.app.setUserInstalled);
    const onSubmit = async (form, { setErrors, setSubmitting }) => {
        try {
            await createUser(form);
            setUserInstalled(true);
        } catch (e) {
            setErrors({ submit: e?.response?.data?.message || e.message });
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography variant="h3">Создание администратора</Typography>
                                                    <Typography variant="caption" fontSize="16px">
                                                        Введите свои учетные данные, чтобы продолжить
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CreateUserForm onSubmit={onSubmit} btnName="Давайте начнем" roles={['admin']} />
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default CreateUser;
