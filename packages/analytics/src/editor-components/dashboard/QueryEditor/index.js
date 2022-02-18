import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Grid, MenuItem, Typography, FormControl, Select, Divider, Fab, Alert, CircularProgress } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { PlayArrow } from '@mui/icons-material';

import MainCard from 'ui-component/cards/MainCard';
import Code from './Code';
import getLanguageByConnector from './configurations/laguages';

import getDbConnections, { apply } from 'api/connections';

import { gridSpacing } from 'store/constant';

const QueryEditor = ({ onResult }) => {
    const [connections, setConnections] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoad] = useState(false);
    const [code, setCode] = useState('');
    const [tokens] = useState(['id', 'name']);
    const [connectionId, setConnectionId] = useState('0');
    const [lang, setLang] = useState('sql');

    useEffect(() => {
        getDbConnections()
            .then((data) => setConnections(data))
            .catch((err) => setError(`ERROR: ${err}`));
    }, []);

    function setChange(val) {
        setConnectionId(val);
        if (Number(val) === 0) {
            setLang('sql');
        } else {
            const connection = connections.find((conn) => Number(conn.id) === Number(val));
            const lang = getLanguageByConnector(connection.provider);
            setLang(lang);
        }
    }

    function onClick() {
        setLoad(true);
        setError(false);
        apply(connectionId, code, {})
            .then((data) => onResult && onResult(data))
            .catch((err) => setError(`ERROR: ${err}`))
            .finally(() => setLoad(false));
    }

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="subtitle2">Запрос</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Подключение</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={connectionId}
                                    label="Подключение"
                                    onChange={(ev) => setChange(ev.target.value)}
                                >
                                    <MenuItem value="0">Предустановленая</MenuItem>
                                    {connections &&
                                        connections.map((conn) => (
                                            <MenuItem key={conn.id} value={conn.id}>
                                                {[conn.name, conn.provider].join(': ')}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider textAlign="right">
                        <Fab size="medium" color="primary" aria-label="add" disabled={load} onClick={() => onClick()}>
                            {load ? <CircularProgress color="secondary" /> : <PlayArrow />}
                        </Fab>
                    </Divider>
                </Grid>
                <Grid item xs={12}>
                    <Code onChange={(code) => setCode(code)} defaultLanguage={lang} code={code} tokens={tokens} />
                </Grid>
                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};

QueryEditor.propTypes = {
    onResult: PropTypes.func
};

export default QueryEditor;
