import _ from 'lodash';
import PropTypes from 'prop-types';
import { Grid, Typography, Box, List, ListItem } from '@mui/material';
// import Alert from '@mui/material/Alert';
// import Editor from '@monaco-editor/react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import AccordionDefault from 'ui-component/Accordion/AccordionDefault';
import Align from 'ui-component/Autocomplete/Align';

import createStorage from './storage';
import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';
// import { useState } from 'react';

const BarChartSettings = ({ data, settings, onChange }) => {
    const settingsName = getSettingsName('BarChart');
    const jsonSettings = _.has(settings, settingsName) ? settings[settingsName] : {};
    console.log(jsonSettings);
    const storage = createStorage(jsonSettings);
    const keys = _.chain(data).head().keys().value();
    let timeout;

    storage.$registerChange(onChange);

    const tm = (call, tm) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(call, tm);
    };

    // const [jsonError, setJsonError] = useState(false);
    // const onCodeChange = (json) => {
    //     setJsonError(false);
    //     try {
    //         const newSettings = JSON.parse(json);
    //         if (onChange) {
    //             onChange(newSettings);
    //         }
    //     } catch (e) {
    //         setJsonError(e.message);
    //     }
    // };

    const exampleCode = `$ \${val} thousands`;

    return (
        <Grid container>
            <Grid item xs={12}>
                <AccordionDefault title="График" defaultExpand={false}>
                    11
                </AccordionDefault>
            </Grid>
            <Grid item xs={12}>
                <AccordionDefault title="Данные" defaultExpand>
                    <Box>
                        <List>
                            <ListItem>
                                <Autocomplete
                                    disablePortal
                                    value={storage.$getSettingValues('options.xaxis.categories') || null}
                                    options={keys}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Надписи" />}
                                    onChange={(_, selected) => storage.$setValue('options.xaxis.categories', selected)}
                                />
                            </ListItem>
                            <ListItem>
                                <Autocomplete
                                    sx={{ width: '100%' }}
                                    multiple
                                    options={keys}
                                    value={storage.$get('series').getSelected()}
                                    filterSelectedOptions
                                    renderInput={(params) => <TextField {...params} label="Колонки" placeholder="Favorites" />}
                                    onChange={(_, selected) => storage.$exec('series', 'setSelected', selected)}
                                />
                            </ListItem>
                        </List>
                    </Box>
                </AccordionDefault>
            </Grid>
            <Grid item xs={12}>
                <AccordionDefault title="Подписи" defaultExpand>
                    <Box>
                        <List>
                            <ListItem>
                                <AccordionDefault title="Заголовок" defaultExpand={false} sx={{ width: '100%' }}>
                                    <List>
                                        <ListItem>
                                            <TextField
                                                label="Надпись"
                                                defaultValue={storage.$getSettingValues('options.title.text') || ''}
                                                variant="outlined"
                                                sx={{ width: '100%' }}
                                                onChange={(ev) => tm(() => storage.$setValue('options.title.text', ev.target.value), 300)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Align
                                                value={storage.$getSettingValues('options.title.align') || null}
                                                onChange={(_, selected) => storage.$setValue('options.title.align', selected)}
                                            />
                                        </ListItem>
                                    </List>
                                </AccordionDefault>
                            </ListItem>
                            <ListItem>
                                <AccordionDefault title="Подпись во всплывающем окне" defaultExpand={false} sx={{ width: '100%' }}>
                                    <List>
                                        <ListItem>
                                            <TextField
                                                label="Подпись во всплывающем окне"
                                                defaultValue={storage.$getSettingValues('options.tooltip.y.formatter') || ''}
                                                variant="outlined"
                                                sx={{ width: '100%' }}
                                                onChange={(ev) =>
                                                    tm(() => storage.$setValue('options.tooltip.y.formatter', ev.target.value), 300)
                                                }
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Typography>Пример:</Typography>
                                            <Typography variant="subtitle2" sx={{ marginLeft: 1 }}>
                                                {exampleCode}
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </AccordionDefault>
                            </ListItem>

                            <ListItem>
                                <AccordionDefault title="Подписи полей" defaultExpand={false} sx={{ width: '100%' }}>
                                    <List>
                                        {keys.map((key) => (
                                            <ListItem key={key}>
                                                <TextField
                                                    id="outlined-basic"
                                                    label={key}
                                                    defaultValue={storage.$get('series').getName(key)}
                                                    variant="outlined"
                                                    sx={{ width: '100%' }}
                                                    onChange={(ev) =>
                                                        tm(() => storage.$exec('series', 'setName', key, ev.target.value), 300)
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDefault>
                            </ListItem>
                        </List>
                    </Box>
                </AccordionDefault>
            </Grid>
            {/* <Grid item xs={12}>
                <AccordionDefault title="Тонкая настройка" defaultExpand={false}>
                    <Editor
                        height="30vh"
                        defaultLanguage="json"
                        value={storage.$settingsJson()}
                        options={{
                            minimap: {
                                enabled: false
                            }
                        }}
                        onChange={(val) => tm(() => onCodeChange(val), 500)}
                    />
                    {jsonError && <Alert severity="error">{jsonError}</Alert>}
                </AccordionDefault>
            </Grid> */}
        </Grid>
    );
};

BarChartSettings.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object,
    onChange: PropTypes.func
};

export default BarChartSettings;
