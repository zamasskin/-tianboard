import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import { Grid, Typography, FormControl, InputLabel, OutlinedInput, Box, Button, Stack, FormHelperText, Alert } from '@mui/material';

import AuthCardWrapper from 'views/pages/authentication/AuthCardWrapper';
import AuthWrapper1 from 'views/pages/authentication/AuthWrapper1';
import Logo from 'ui-component/Logo';
import Error from 'ui-component/forms/validation/Error';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AccountService from 'services/AccountService';
import { useState } from 'react';

const Forgot = () => {
    const theme = useTheme();
    const initValues = {
        email: ''
    };

    const [success, setSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Должен быть действующий адрес электронной почты').max(255).required('требуется Email')
    });

    const handleSubmit = async (form, { setErrors, setSubmitting }) => {
        try {
            await AccountService.forgot(form.email);
            setSuccess(true);
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
                                    {success ? (
                                        <Grid item xs={12}>
                                            <Alert severity="success">
                                                Для продолжения перейдите в почтовый ящик, и следуйте инструкциям
                                            </Alert>
                                        </Grid>
                                    ) : (
                                        <>
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="center">
                                                    <Grid item>
                                                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                            <Typography variant="h3">Восстановление пароля</Typography>
                                                            <Typography variant="caption" fontSize="16px">
                                                                Введите свой email, чтобы продолжить
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Formik
                                                    validationSchema={validationSchema}
                                                    initialValues={initValues}
                                                    onSubmit={handleSubmit}
                                                >
                                                    {({
                                                        errors,
                                                        handleBlur,
                                                        handleChange,
                                                        handleSubmit,
                                                        isSubmitting,
                                                        touched,
                                                        values
                                                    }) => (
                                                        <form noValidate onSubmit={handleSubmit}>
                                                            <FormControl
                                                                fullWidth
                                                                error={Boolean(touched.email && errors.email)}
                                                                sx={{ ...theme.typography.customInput }}
                                                            >
                                                                <InputLabel htmlFor="outlined-adornment-email-register">Имя</InputLabel>
                                                                <OutlinedInput
                                                                    type="email"
                                                                    error={errors.email && touched.email}
                                                                    value={values.email}
                                                                    name="email"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    inputProps={{}}
                                                                />
                                                                <Error error={errors.email} touched={touched.email} />
                                                            </FormControl>
                                                            {errors.submit && (
                                                                <Box sx={{ mt: 3 }}>
                                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                                </Box>
                                                            )}
                                                            <Box sx={{ mt: 2 }}>
                                                                <AnimateButton>
                                                                    <Button
                                                                        disableElevation
                                                                        disabled={isSubmitting}
                                                                        fullWidth
                                                                        size="large"
                                                                        type="submit"
                                                                        variant="contained"
                                                                        color="secondary"
                                                                    >
                                                                        Восстановить
                                                                    </Button>
                                                                </AnimateButton>
                                                            </Box>
                                                        </form>
                                                    )}
                                                </Formik>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Forgot;
