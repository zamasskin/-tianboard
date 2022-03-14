import { FormControl, InputLabel, OutlinedInput, Button, Box, FormHelperText, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'ui-component/extended/AnimateButton';
import ErrorComponent from 'ui-component/forms/validation/Error';

function FromConnection1({ connectionType, onSubmit, submitName = 'Подключить', params = {}, cancelBtn = false, onCancel }) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const initValues = {
        connectionName: params.connectionName || '',
        type: connectionType,
        formType: 'file'
    };
    const validationSchema = Yup.object().shape({
        connectionName: Yup.string().required('требуется название')
    });

    return (
        <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={onSubmit}>
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
                            type="text"
                            value={values.connectionName}
                            name="connectionName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        <ErrorComponent error={errors.connectionName} touched={touched.connectionName} />
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
                                        {submitName}
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    );
}

FromConnection1.propTypes = {
    connectionType: PropTypes.string,
    onSubmit: PropTypes.func,
    submitName: PropTypes.string,
    params: PropTypes.object,
    cancelBtn: PropTypes.bool,
    onCancel: PropTypes.func
};

export default FromConnection1;
