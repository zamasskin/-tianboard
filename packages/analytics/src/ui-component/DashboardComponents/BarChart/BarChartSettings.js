import _ from 'lodash';
import PropTypes from 'prop-types';
import { Grid, Typography, Box, List, ListItem, Divider } from '@mui/material';
// import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import Accordion, { AccordionDetails, AccordionSummary } from 'ui-component/Accordion';

import createStorage from './storage';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';
import { useState } from 'react';

const BarChartSettings = ({ data, settings, onChange }) => {
    const settingsName = getSettingsName('BarChart');
    const jsonSettings = _.has(settings, settingsName) ? settings[settingsName] : {};
    const storage = createStorage(jsonSettings);
    const keys = _.chain(data).head().keys().value();
    let timeout;

    const setSeries = (selected) => {
        storage.$get('series').setSelected(selected);
        if (onChange) onChange(storage.$settings());
    };

    const setSeriesName = (key, name) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            storage.$get('series').setName(key, name);
            if (onChange) onChange(storage.$settings());
        }, 1000);
    };

    const setXAxisCategories = (selected) => {
        storage.$setValue('options.xaxis.categories', selected);
        if (onChange) onChange(storage.$settings());
    };
    const [hidden, setHidden] = useState([]);
    const toggleExpanded = (name) => {
        if (hidden.includes(name)) {
            setHidden(hidden.filter((hiddenName) => hiddenName !== name));
        } else {
            setHidden([...hidden, name]);
        }
    };

    const setTooltipYFormatter = (format) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            storage.$setValue('options.tooltip.y.formatter', format);
            console.log(storage.$values());
            if (onChange) onChange(storage.$settings());
        }, 1000);
    };

    const exampleCode = `$ \${val} thousands`;

    return (
        <Grid container>
            <Grid item xs={12}>
                <Accordion expanded={!hidden.includes('data')} onChange={() => toggleExpanded('data')}>
                    <AccordionSummary>
                        <Typography>Данные</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <List>
                                <ListItem>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        value={storage.$getSettingValues('options.xaxis.categories') || null}
                                        options={keys}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField {...params} label="Надписи" />}
                                        onChange={(_, selected) => setXAxisCategories(selected)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Autocomplete
                                        sx={{ width: '100%' }}
                                        multiple
                                        id="tags-outlined"
                                        options={keys}
                                        value={storage.$get('series').getSelected()}
                                        filterSelectedOptions
                                        renderInput={(params) => <TextField {...params} label="Колонки" placeholder="Favorites" />}
                                        onChange={(_, selected) => setSeries(selected)}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid item xs={12}>
                <Accordion expanded={!hidden.includes('signatures')} onChange={() => toggleExpanded('signatures')}>
                    <AccordionSummary>
                        <Typography>Подписи</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <List>
                                <ListItem>
                                    <TextField
                                        id="outlined-basic"
                                        label="Подпись во всплывающем окне"
                                        defaultValue={storage.$getSettingValues('options.tooltip.y.formatter') || ''}
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        onChange={(ev) => setTooltipYFormatter(ev.target.value)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Typography>Пример:</Typography>
                                    <Typography variant="subtitle2" sx={{ marginLeft: 1 }}>
                                        {exampleCode}
                                    </Typography>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <Accordion sx={{ width: '100%' }}>
                                        <AccordionSummary>
                                            <Typography>Подписи полей</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List>
                                                {keys.map((key) => (
                                                    <ListItem key={key}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label={key}
                                                            defaultValue={storage.$get('series').getName(key)}
                                                            variant="outlined"
                                                            sx={{ width: '100%' }}
                                                            onChange={(ev) => setSeriesName(key, ev.target.value)}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </ListItem>
                            </List>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );
};

BarChartSettings.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object,
    onChange: PropTypes.func
};

export default BarChartSettings;
