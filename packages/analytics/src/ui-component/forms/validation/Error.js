import { FormHelperText } from '@mui/material';

const Error = ({ error, touched }) => {
    if (error && touched) {
        return (
            <FormHelperText error id="standard-weight-helper-text--register">
                {error}
            </FormHelperText>
        );
    }
    return false;
};

export default Error;
