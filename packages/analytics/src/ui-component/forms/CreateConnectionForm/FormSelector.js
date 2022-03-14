import PropTypes from 'prop-types';
import { Alert } from '@mui/material';

import { databases } from './index';
import FromConnection3 from './FromConnection3';
import FromConnection2 from './FromConnection2';

const FormSelector = ({ params = {}, ...props }) => {
    const { type } = params;

    if (!type) {
        return <Alert severity="error">type not found</Alert>;
    }

    if (type === 'postgresql') {
        if (params?.contextName) {
            return (
                <FromConnection3
                    connectionType="postgresql"
                    placeholder="postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]"
                    params={params}
                    {...props}
                />
            );
        }
        return <FromConnection2 connectionType="postgresql" defaultPort="5432" params={params} {...props} />;
    }

    const database = databases.find((db) => db.id === type);
    if (!database) {
        return <Alert severity="error">Database not found</Alert>;
    }

    const Form = database.component;

    return <Form params={params} {...props} />;
};

FormSelector.propTypes = {
    onSubmit: PropTypes.func,
    submitName: PropTypes.string,
    params: PropTypes.object,
    cancelBtn: PropTypes.bool,
    onCancel: PropTypes.func
};

export default FormSelector;
