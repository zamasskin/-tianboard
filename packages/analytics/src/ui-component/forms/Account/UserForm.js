import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import * as yup from 'yup';
import {
    Grid,
    Typography,
    useMediaQuery,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Box,
    Button,
    FormHelperText,
    Select,
    Chip,
    MenuItem,
    Alert
} from '@mui/material';

import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import Error from 'ui-component/forms/validation/Error';
import AccountService from 'services/AccountService';

const UserForm = ({ onSubmit, onCancel, btnName = 'Создать', params = {}, cancelBtn = false }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [showPassword, setShowPassword] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const loadRoles = async () => {
        setLoading(true);
        try {
            const response = await AccountService.roles();
            setUserRoles(response.data);
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || '');
        } finally {
            setLoading(false);
        }
    };
    useState(() => loadRoles(), []);

    const initValues = {
        firstName: params?.firstName || '',
        secondName: params?.secondName || '',
        email: params?.email || '',
        // password: '',
        roles: params?.roles || []
    };

    const validationSchema = yup.object().shape({
        firstName: yup.string().max(255).required('требуется имя'),
        secondName: yup.string().max(255).required('требуется фамилия'),
        email: yup.string().email('Должен быть действующий адрес электронной почты').max(255).required('требуется Email'),
        // password:yup.string().max(255).required('требуется пароль'),
        roles: yup.array().of(yup.string()).min(1, 'Должна быть выбрана хотя-бы одна группа').required('Требуется группа')
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

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={onSubmit}>
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
                                value={values.password || ''}
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
                        <FormControl fullWidth sx={{ ...theme.typography.customSelect }} error={Boolean(touched.roles && errors.roles)}>
                            <InputLabel id="demo-multiple-chip-label">Группа пользователя</InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                name="roles"
                                value={values.roles}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                input={<OutlinedInput id="select-multiple-chip" label="Группа пользователя" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {userRoles.map(({ name, value }) => (
                                    <MenuItem key={value} value={value}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Error error={errors.roles} touched={touched.roles && touched.roles.find((val) => !!val)} />
                        </FormControl>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            {cancelBtn && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ mt: 2 }}>
                                        <AnimateButton>
                                            <Button
                                                disableElevation
                                                disabled={isSubmitting}
                                                fullWidth
                                                size="large"
                                                type="button"
                                                onClick={onCancel}
                                                variant="contained"
                                                color="common"
                                            >
                                                Отмена
                                            </Button>
                                        </AnimateButton>
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={12} sm={cancelBtn ? 6 : 12}>
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
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

UserForm.propTypes = {
    onSubmit: PropTypes.func,
    btnName: PropTypes.string,
    cancelBtn: PropTypes.bool,
    onCancel: PropTypes.func,
    params: PropTypes.object
};

export default UserForm;
