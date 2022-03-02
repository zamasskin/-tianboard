import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import * as yup from 'yup';
import {
    Grid,
    Stack,
    Typography,
    useMediaQuery,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Box,
    Button,
    FormHelperText
} from '@mui/material';

import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

const Error = ({ error, touched }) => {
    if (error && touched) {
        return (
            <FormHelperText error id="standard-weight-helper-text--register">
                {error}
            </FormHelperText>
        );
    }
    return false;
};

const CreateUserForm = ({ onSubmit, btnName = 'Создать' }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [showPassword, setShowPassword] = useState(false);

    const initValues = {
        firstName: '',
        secondName: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    const validationSchema = yup.object().shape({
        firstName: yup.string().max(255).required('требуется имя'),
        secondName: yup.string().max(255).required('требуется фамилия'),
        email: yup.string().email('Должен быть действующий адрес электронной почты').max(255).required('требуется Email'),
        password: yup.string().max(255).required('требуется пароль'),
        confirmPassword: yup
            .string()
            .required('требуется подтверждение пароля')
            .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    });

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const changePassword = (ev) => {
        const temp = strengthIndicator(ev.target.value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={(form) => onSubmit && onSubmit(form)}>
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.firstName && errors.firstName)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-email-register">Имя</InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        value={values.firstName}
                                        name="firstName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    <Error error={errors.firstName} touched={touched.firstName} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.secondName && errors.secondName)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-email-register">Имя</InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        value={values.secondName}
                                        name="secondName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    <Error error={errors.secondName} touched={touched.secondName} />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Имя</InputLabel>
                            <OutlinedInput
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            <Error error={errors.email} touched={touched.email} />
                        </FormControl>
                        <FormControl
                            fullWidth
                            sx={{ ...theme.typography.customInput }}
                            error={Boolean(touched.password && errors.password)}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Пароль</InputLabel>
                            <OutlinedInput
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Пароль"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e);
                                }}
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
                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}
                        <FormControl
                            fullWidth
                            sx={{ ...theme.typography.customInput }}
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Подтверждение пароля</InputLabel>
                            <OutlinedInput
                                type={showPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                name="confirmPassword"
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
                            <Error error={errors.confirmPassword} touched={touched.confirmPassword} />
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
                                    {btnName}
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

CreateUserForm.propTypes = {
    onSubmit: PropTypes.func,
    btnName: PropTypes.string
};

export default CreateUserForm;
