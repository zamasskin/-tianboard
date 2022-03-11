import { FormControl, InputLabel, OutlinedInput, Button, Box, FormHelperText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import ErrorComponent from 'ui-component/forms/validation/Error';

function FromConnection3({ connectionType, placeholder, onSubmit, connectionName = '', submitName = 'Подключить' }) {
    const theme = useTheme();
    const initValues = {
        connectionName,
        clientUrl: '',
        type: connectionType,
        formType: 'url'
    };
    const validationSchema = Yup.object().shape({
        connectionName: Yup.string().required('требуется название'),
        clientUrl: Yup.string().required('требуется URL')
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
                            placeholder={placeholder}
                            label="Название"
                            type="text"
                            value={values.connectionName}
                            name="connectionName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        <ErrorComponent error={errors.connectionName} touched={touched.connectionName} />
                    </FormControl>
                    <FormControl fullWidth error={Boolean(touched.clientUrl && errors.clientUrl)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-register" name="clientUrl">
                            URL
                        </InputLabel>
                        <OutlinedInput
                            placeholder={placeholder}
                            label="URL"
                            type="text"
                            value={values.clientUrl}
                            name="clientUrl"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        <ErrorComponent error={errors.clientUrl} touched={touched.clientUrl} />
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
                                {submitName}
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
}

FromConnection3.propTypes = {
    connectionType: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func,
    connectionName: PropTypes.string,
    submitName: PropTypes.string
};

export default FromConnection3;
