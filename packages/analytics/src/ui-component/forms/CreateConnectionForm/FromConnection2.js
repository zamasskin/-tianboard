import _ from 'lodash';
import { FormControl, InputLabel, OutlinedInput, Button, Box, Grid, useMediaQuery, InputAdornment, IconButton, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import Error from 'ui-component/forms/validation/Error';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { fetchPostJson } from 'api/fetch';

function FromConnection2({ connectionType, defaultPort, onSuccess }) {
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const initValues = {
        connectionName: '',
        port: '',
        host: '',
        user: '',
        password: '',
        type: connectionType
    };
    const validationSchema = Yup.object().shape({
        connectionName: Yup.string().required('требуется название'),
        host: Yup.string().required('требуется хост'),
        password: Yup.string().required('требуется пароль'),
        user: Yup.string().required('требуется имя пользователя'),
        port: Yup.number()
            .typeError('должно быть числом')
            .required('требуется порт')
            .positive('не должно быть отрицательным')
            .integer('число должно быть целым')
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (value) => {
        setError(false);
        try {
            const result = await fetchPostJson('/connections/create', value);
            if (_.has(result, 'errors') && _.has(result, 'message')) {
                throw new Error(_.get(result, 'message'));
            }
            if (onSuccess) {
                onSuccess(true);
            }
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={handleSubmit}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <FormControl
                        fullWidth
                        error={Boolean(touched.connectionName && errors.connectionName)}
                        sx={{ ...theme.typography.customInput }}
                    >
                        <InputLabel htmlFor="outlined-adornment-email-register" name="connectionName">
                            Название
                        </InputLabel>
                        <OutlinedInput
                            label="Название"
                            type="text"
                            value={values.connectionName}
                            name="connectionName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        <Error error={errors.connectionName} touched={touched.connectionName} />
                    </FormControl>
                    <Grid container spacing={matchDownSM ? 0 : 2}>
                        <Grid item xs={12} sm={8}>
                            <FormControl fullWidth error={Boolean(touched.host && errors.host)} sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-email-register">Хост</InputLabel>
                                <OutlinedInput
                                    placeholder="localhost"
                                    label="Хост"
                                    type="text"
                                    value={values.host}
                                    name="host"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                <Error error={errors.host} touched={touched.host} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth error={Boolean(touched.port && errors.port)} sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-email-register">Порт</InputLabel>
                                <OutlinedInput
                                    placeholder={defaultPort}
                                    type="text"
                                    value={values.port}
                                    name="port"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                <Error error={errors.port} touched={touched.port} />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <FormControl fullWidth error={Boolean(touched.user && errors.user)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-register">Имя пользователя</InputLabel>
                        <OutlinedInput
                            placeholder="root"
                            type="text"
                            value={values.user}
                            name="user"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        <Error error={errors.user} touched={touched.user} />
                    </FormControl>
                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-register" name="name">
                            Пароль
                        </InputLabel>
                        <OutlinedInput
                            label="Пароль"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            name="password"
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
                        />
                        <Error error={errors.password} touched={touched.password} />
                    </FormControl>
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
                                Подключить
                            </Button>
                        </AnimateButton>
                    </Box>
                    {error && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    )}
                </form>
            )}
        </Formik>
    );
}

FromConnection2.propTypes = {
    connectionType: PropTypes.string,
    defaultPort: PropTypes.string,
    onSuccess: PropTypes.func
};

export default FromConnection2;
