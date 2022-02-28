import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Align = ({ onChange, value }) => (
    <Autocomplete
        disablePortal
        value={value}
        options={['left', 'center', 'right']}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Выравнивание" />}
        onChange={onChange}
    />
);

Align.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
};

export default Align;
