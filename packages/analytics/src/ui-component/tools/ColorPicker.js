import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import * as colors from '@mui/material/colors';
import { Grid, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import RadioMui from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { borderRadius } from '@mui/system';

const Radio = styled(RadioMui)(({ bgColor }) => ({
    background: bgColor,
    borderRadius: 0
}));

Radio.propTypes = {
    bgColor: PropTypes.string
};

const ColorPicker = ({ value = '#f50057' }) => {
    const colorNames = Object.keys(colors);
    const themes = [];
    Object.entries(colors).forEach(([colorName, colorsTheme]) => {
        Object.entries(colorsTheme).forEach(([colorTheme, color]) => {
            themes.push({ colorName, colorTheme, color });
        });
    });

    const { colorTheme, colorName } = themes.find(({ color }) => color === value);
    const selectThemeColors = themes.filter(({ colorTheme: theme }) => theme === colorTheme);

    return (
        <Grid item xs={12}>
            <Box component="div" sx={{ width: 192 }}>
                <Radio checkedIcon={<CheckIcon />} bgColor="#000">
                    1212
                </Radio>
            </Box>
            {/* <div>112</div> */}
        </Grid>

        // <RadioGroup defaultValue={value}>
        //     {/* {selectThemeColors.map(({ color }) => (
        //         <Box sx={{}}>1</Box>
        //     ))} */}
        // </RadioGroup>
    );
};

ColorPicker.propTypes = {};

export default ColorPicker;
