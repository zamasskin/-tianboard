import { FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';

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

Error.propTypes = {
    error: PropTypes.string,
    touched: PropTypes.string
};

export default Error;
