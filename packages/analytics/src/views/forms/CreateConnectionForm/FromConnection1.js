import { FormControl, InputLabel, OutlinedInput, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import { string } from 'helpers/dashboar/edit';
import Error from 'views/forms/validation/Error';

function FromConnection1({ connectionType, ...props }) {
    console.log(props);
    const theme = useTheme();
    const initValues = {
        connectionName: ''
    };
    const validationSchema = Yup.object().shape({
        connectionName: Yup.string().required('требуется название')
    });

    const tm = (ms) => new Promise((ok) => setTimeout(ok, ms));

    const handleSubmit = async (val) => {
        await tm(1000);
        console.log(val);
        return false;
    };

    return (
        <Formik validationSchema={validationSchema} initialValues={initValues} onSubmit={handleSubmit}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <input type="hidden" name="type" value={connectionType} />
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
                        <Error error={errors.connectionName} touched={touched.connectionName} />
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

FromConnection1.propTypes = {
    connectionType: PropTypes.string
};

export default FromConnection1;
