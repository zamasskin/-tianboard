import _ from 'lodash';
import { useState } from 'react';
import { FormControl, InputLabel, OutlinedInput, Button, Box, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'ui-component/extended/AnimateButton';
import ErrorComponent from 'views/forms/validation/Error';
import { fetchPostJson } from 'api/fetch';

function FromConnection1({ connectionType, onSuccess }) {
    const [error, setError] = useState(false);
    const theme = useTheme();
    const initValues = {
        connectionName: '',
        type: connectionType
    };
    const validationSchema = Yup.object().shape({
        connectionName: Yup.string().required('требуется название')
    });

    const handleSubmit = async (value) => {
        setError(false);
        try {
            const result = await fetchPostJson('/connections/create/by-file', value);
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
        <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={handleSubmit} onChange={() => setError(false)}>
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

FromConnection1.propTypes = {
    connectionType: PropTypes.string
};

export default FromConnection1;
