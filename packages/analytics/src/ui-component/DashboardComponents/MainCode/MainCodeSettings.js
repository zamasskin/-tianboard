import React from 'react';
import PropTypes from 'prop-types';

function MainCodeSettings({ settings, data, onChange }) {
    console.log(settings, data);
    return <div>MainCodeSettings</div>;
}

MainCodeSettings.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object,
    onChange: PropTypes.func
};

export default MainCodeSettings;
