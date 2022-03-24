import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import ruLocale from 'date-fns/locale/ru';
import {
    Grid,
    useMediaQuery,
    FormControl,
    InputLabel,
    OutlinedInput,
    Box,
    Button,
    FormHelperText,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Switch,
    Stack,
    TextField
} from '@mui/material';

import Error from 'ui-component/forms/validation/Error';
import AnimateButton from 'ui-component/extended/AnimateButton';

import TaskService from 'services/TaskService';

const EditTask = ({ onSubmit, onCancel, values = {} }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [date, setDate] = useState(values?.dateStart ? new Date(values?.dateStart) : null);
    const [actions, setActions] = useState(false);
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const loadActions = async () => {
        try {
            const response = await TaskService.action();
            setActions(response.data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActions();
    }, []);

    const initValues = {
        name: values?.name || '',
        recurrent: values?.recurrent || true,
        dateStart: values?.dateStart || null,
        cronExpression: values?.cronExpression || '',
        action: values?.action || '',
        actionId: values?.actionId || 0
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255).required('требуется название'),
        recurrent: Yup.bool().required('требуется выбрать тип'),
        action: Yup.string().required('требуется  действие'),
        actionId: Yup.number()
            .required('требуется  ид действие')
            .test('Is positive?', 'Ид действия должно быть больше 0', (value) => value > 0)
    });

    const handleSubmit = (form, ...args) => {
        form.dateStart = date;
        onSubmit(form, ...args);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return error;
    }

    return (
        <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={handleSubmit}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Stack direction="row" spacing={2}>
                        <Box>
                            {values.recurrent ? (
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.cronExpression && errors.cronExpression)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-email-register">Выражение cron</InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        value={values.cronExpression}
                                        name="cronExpression"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                        placeholder="* * * * * *"
                                    />
                                </FormControl>
                            ) : (
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.cronExpression && errors.cronExpression)}
                                    sx={{ ...theme.typography.customDatePicker }}
                                >
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                                        <DatePicker
                                            mask="__.__.____"
                                            label="Дата запуска"
                                            value={date}
                                            onChange={(newDate) => setDate(newDate)}
                                            renderInput={(params) => (
                                                <TextField {...params} onInput={(e) => console.log(e)} onBlur={handleBlur} />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            )}
                        </Box>
                        <Box>
                            <FormControl
                                fullWidth
                                error={Boolean(touched.recurrent && errors.recurrent)}
                                sx={{ ...theme.typography.customInput }}
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        checked={values.recurrent}
                                        onChange={handleChange}
                                        control={<Switch name="recurrent" />}
                                        label="Переодический"
                                    />
                                </FormGroup>
                                <Error error={errors.recurrent} touched={touched.recurrent} />
                            </FormControl>
                        </Box>
                    </Stack>
                    <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-register">Название задачи</InputLabel>
                        <OutlinedInput
                            type="text"
                            value={values.name}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        <Error error={errors.name} touched={touched.name} />
                    </FormControl>

                    <Grid container spacing={matchDownSM ? 0 : 2}>
                        <Grid item xs={12} sm={10}>
                            <FormControl
                                fullWidth
                                sx={{ ...theme.typography.customSelect }}
                                error={Boolean(touched.action && errors.action)}
                            >
                                <InputLabel>Действие</InputLabel>
                                {actions && (
                                    <Select
                                        name="action"
                                        value={values.action}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="Группа пользователя" />}
                                    >
                                        <MenuItem value="">Не выбрано</MenuItem>
                                        {actions.map((action) => (
                                            <MenuItem key={action} value={action}>
                                                {action}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}

                                <Error error={errors.action} touched={touched.action} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <FormControl
                                fullWidth
                                error={Boolean(touched.actionId && errors.actionId)}
                                sx={{ ...theme.typography.customInput }}
                            >
                                <InputLabel htmlFor="outlined-adornment-email-register">Ид действия</InputLabel>
                                <OutlinedInput
                                    type="text"
                                    value={values.actionId}
                                    name="actionId"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                <Error error={errors.actionId} touched={touched.actionId} />
                            </FormControl>
                        </Grid>
                    </Grid>
                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                    <Grid container spacing={matchDownSM ? 0 : 2}>
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
                        <Grid item xs={12} sm={6}>
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
                                        Сохранить
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    );
};

EditTask.propTypes = {
    onSubmit: PropTypes.func,
    values: PropTypes.object,
    onCancel: PropTypes.func
};

export default EditTask;
