import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import Editor from '@monaco-editor/react';
import YAML from 'yaml';

import MainCard from 'ui-component/cards/MainCard';
import { getSettings } from 'ui-component/DashboardComponents';

const SettingsEdit = ({ settings, data }) => (
    <Grid item xs={12}>
        <MainCard>
            <Grid container>
                <Grid item xs={12}>
                    <Editor language="yaml" height="20vh" value={getSettings(settings, data)} />
                </Grid>
            </Grid>
        </MainCard>
    </Grid>
);

SettingsEdit.propTypes = {
    settings: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object)
};

export default SettingsEdit;
