import { useState } from 'react';
import { FormControl, InputLabel, OutlinedInput, Button, Box, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import _ from 'lodash';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import { string } from 'helpers/dashboar/edit';
import ErrorComponent from 'ui-component/forms/validation/Error';
import { fetchPostJson } from 'api/fetch';

function FromConnection3({ connectionType, placeholder, onSuccess }) {
    const [error, setError] = useState(false);
    const theme = useTheme();
    const initValues = {
        connectionName: '',
        clientUrl: '',
        type: connectionType
    };
    const validationSchema = Yup.object().shape({
        connectionName: Yup.string().required('требуется название'),
        clientUrl: Yup.string().required('требуется URL')
    });

    const handleSubmit = async (value) => {
        setError(false);
        try {
            const result = await fetchPostJson('/connections/create/by-url', value);
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

FromConnection3.propTypes = {
    connectionType: PropTypes.string,
    placeholder: PropTypes.string
};

export default FromConnection3;
