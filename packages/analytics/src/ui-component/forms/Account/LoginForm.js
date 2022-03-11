import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Box,
    Button,
    Stack,
    FormControlLabel,
    Checkbox,
    Typography,
    Link,
    FormHelperText
} from '@mui/material';
import * as yup from 'yup';
import { useStoreActions } from 'easy-peasy';

import { Formik } from 'formik';

import Error from 'ui-component/forms/validation/Error';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginForm = ({ onLogin }) => {
    const login = useStoreActions((actions) => actions.account.login);
    const email = localStorage.getItem('rememberMe') || '';
    const theme = useTheme();
    const [checked, setChecked] = useState(email.length > 0);

    const initValues = {
        email,
        password: ''
    };

    const validationSchema = yup.object().shape({
        email: yup.string().email('Должен быть действующий адрес электронной почты').max(255).required('требуется Email'),
        password: yup.string().max(255).required('требуется пароль')
    });

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (form, { setErrors, setSubmitting }) => {
        if (checked && form.email) {
            localStorage.setItem('rememberMe', form.email);
        } else {
            localStorage.setItem('rememberMe', '');
        }

        try {
            await login(form);
            if (onLogin) setTimeout(() => onLogin(), 100);
        } catch (e) {
            setErrors({ submit: e?.response?.data?.message || e.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={handleSubmit}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
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
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }} error={Boolean(touched.password && errors.password)}>
                        <InputLabel htmlFor="outlined-adornment-password-register">Пароль</InputLabel>
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            error={errors.password && touched.password}
                            name="password"
                            label="Пароль"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        size="large"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            inputProps={{}}
                        />
                        <Error error={errors.password} touched={touched.password} />
                    </FormControl>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(event) => setChecked(event.target.checked)}
                                    name="checked"
                                    color="primary"
                                />
                            }
                            label="Запомни меня"
                        />
                        <Link href="/forgot" underline="none">
                            <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                                Забыли пароль?
                            </Typography>
                        </Link>
                    </Stack>
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
                                Войти
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

LoginForm.propTypes = {
    onLogin: PropTypes.func
};

export default LoginForm;
