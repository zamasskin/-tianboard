import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import * as yup from 'yup';
import {
    Grid,
    Typography,
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
import Error from 'ui-component/forms/validation/Error';

const RestoreForm = ({ onSubmit }) => {
    const theme = useTheme();

    const initValues = {
        password: '',
        confirmPassword: ''
    };

    const validationSchema = yup.object().shape({
        password: yup.string().max(255).required('требуется пароль'),
        confirmPassword: yup
            .string()
            .required('требуется подтверждение пароля')
            .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    });

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);

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
        <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={onSubmit}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }} error={Boolean(touched.password && errors.password)}>
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
                                        <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
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
                            label="Подтверждение пароля"
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
                                Востановить и продолжить
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

RestoreForm.propTypes = {
    onSubmit: PropTypes.func
};

export default RestoreForm;
