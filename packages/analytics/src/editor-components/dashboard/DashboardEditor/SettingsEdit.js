import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import Editor from '@monaco-editor/react';

import MainCard from 'ui-component/cards/MainCard';
import { getSettings } from 'ui-component/DashboardComponents';
import { mergeSetting } from 'editor-components/dashboard/DashboardEditor/constant';

const SettingsEdit = ({ settings, data, onChange }) => (
    <Grid item xs={12}>
        <MainCard>
            <Grid container>
                <Grid item xs={12}>
                    <Editor
                        language="yaml"
                        height="20vh"
                        value={getSettings(settings, data)}
                        onChange={(code) => onChange && onChange(mergeSetting(settings, code))}
                    />
                </Grid>
            </Grid>
        </MainCard>
    </Grid>
);

SettingsEdit.propTypes = {
    settings: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
};

export default SettingsEdit;
