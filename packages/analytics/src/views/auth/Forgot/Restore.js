import { Grid, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import AuthCardWrapper from 'views/pages/authentication/AuthCardWrapper';
import AuthWrapper1 from 'views/pages/authentication/AuthWrapper1';
import Logo from 'ui-component/Logo';
import RestoreForm from 'ui-component/forms/Account/RestoreForm';

import AccountService from 'services/AccountService';

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSubmit = async (form, { setErrors, setSubmitting }) => {
        try {
            await AccountService.restore(searchParams.get('uuid'), searchParams.get('email'), form.password);
            await AccountService.login(searchParams.get('email'), form.password);
            navigate('/');
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
                                                    <Typography variant="h3">Восстановление пароля</Typography>
                                                    <Typography variant="caption" fontSize="16px">
                                                        Введите новый пароль чтобы продолжить
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RestoreForm onSubmit={handleSubmit} />
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

export default Login;
