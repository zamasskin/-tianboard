import { Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

import { getSettingsRows, settingsColumns, getUpdateSettings, getSelection, getCodeWhenSelected, getSettings } from './helpers';
import { useState } from 'react';

const DataGridSettings = ({ data, settings, onChange }) => {
    const [loading, setLoading] = useState(false);
    const { error, ...parseSettings } = getSettings(data, settings);
    if (error) {
        return <Alert severity="error">{error.message}</Alert>;
    }

    const onSelect = (selected) => {
        if (onChange) {
            setLoading(true);
            const code = getCodeWhenSelected(selected, parseSettings);
            onChange(code);
            setTimeout(() => setLoading(false), 1200);
        }
    };

    const onEdit = (newSettings) => {
        if (onChange) {
            const code = getUpdateSettings(newSettings, parseSettings);
            onChange(code);
        }
    };
    return (
        <Grid container>
            <Grid item xs>
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        disableSelectionOnClick
                        rows={getSettingsRows(data, settings)}
                        columns={settingsColumns}
                        checkboxSelection
                        selectionModel={getSelection(data, settings)}
                        onSelectionModelChange={onSelect}
                        loading={loading}
                        onEditRowsModelChange={onEdit}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

DataGridSettings.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object,
    onChange: PropTypes.func
};

export default DataGridSettings;
