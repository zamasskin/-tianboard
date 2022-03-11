import { FormControl, InputLabel, OutlinedInput, Button, Box, FormHelperText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'ui-component/extended/AnimateButton';
import ErrorComponent from 'ui-component/forms/validation/Error';

function FromConnection1({ connectionType, onSubmit, submitName = 'Подключить', params = {} }) {
    const theme = useTheme();
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

FromConnection1.propTypes = {
    connectionType: PropTypes.string,
    onSubmit: PropTypes.func,
    submitName: PropTypes.string,
    params: PropTypes.object
};

export default FromConnection1;
