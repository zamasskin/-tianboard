import { FormControl, InputLabel, OutlinedInput, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import { string } from 'helpers/dashboar/edit';
import Error from 'views/forms/validation/Error';

function FromConnection3({ connectionType, placeholder }) {
    const theme = useTheme();
    const initValues = {
        name: ''
    };
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('требуется URL')
    });

    return (
        <Formik validationSchema={validationSchema} initialValues={initValues}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <input type="hidden" name="connectionType" value={connectionType} />
                    <FormControl fullWidth error={Boolean(touched.url && errors.url)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-register" name="name">
                            URL
                        </InputLabel>
                        <OutlinedInput
                            placeholder={placeholder}
                            label="URL"
                            type="text"
                            value={values.url}
                            name="url"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        <Error error={errors.url} touched={touched.url} />
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
