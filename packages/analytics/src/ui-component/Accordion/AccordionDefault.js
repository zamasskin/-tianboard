import { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

import Accordion, { AccordionDetails, AccordionSummary } from '.';

const AccordionDefault = ({ children, title, defaultExpand, ...props }) => {
    const [expand, setExpand] = useState(defaultExpand);
    return (
        <Accordion expanded={expand} onChange={() => setExpand(!expand)} {...props}>
            <AccordionSummary>
                <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
};

AccordionDefault.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    defaultExpand: PropTypes.bool
};

export default AccordionDefault;
