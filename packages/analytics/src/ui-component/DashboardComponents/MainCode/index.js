import React from 'react';
import PropTypes from 'prop-types';

function MainCode({ data, settings }) {
    console.log(data, settings);
    return <div>MainCode</div>;
}

MainCode.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object
};

export default MainCode;
