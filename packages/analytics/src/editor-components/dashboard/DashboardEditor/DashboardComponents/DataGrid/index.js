import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { Grid, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import MainCard from 'ui-component/cards/MainCard';

import { getRows, getColumns, getSettingsRows, settingsColumns, getUpdateSettings, getSelection } from './helpers';
import { useState } from 'react';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0
    },
    '&:before': {
        display: 'none'
    }
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1)
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

const DataGrid = ({ data, settings, onChange, edit = false }) => {
    const [expanded, setExpanded] = useState(true);
    if (data.length === 0) {
        return (
            <MainCard>
                <Typography>Нет данных</Typography>
            </MainCard>
        );
    }

    if (edit) {
        return (
            <MainCard>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={7} style={{ paddingRight: 10 }}>
                            <div style={{ height: 500, width: '100%' }}>
                                <MuiDataGrid rows={getRows(data)} columns={getColumns(data, settings)} editable />
                            </div>
                        </Grid>
                        <Grid item xs style={{ paddingLeft: 10 }}>
                            <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                    <Typography>Общие настройки</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ height: 500, width: '100%' }}>
                                        <MuiDataGrid
                                            disableSelectionOnClick
                                            rows={getSettingsRows(data, settings)}
                                            columns={settingsColumns}
                                            checkboxSelection
                                            selectionModel={getSelection(data, settings)}
                                            onSelectionModelChange={(selected) =>
                                                onChange && onChange({ ...settings, dataGridColumnSelection: selected })
                                            }
                                            onEditRowsModelChange={(newSettings) =>
                                                onChange && onChange(getUpdateSettings(newSettings, settings))
                                            }
                                        />
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        );
    }

    return (
        <MainCard>
            <Grid item xs={12}>
                <div style={{ height: 500, width: '100%' }}>
                    <MuiDataGrid rows={getRows(data)} columns={getColumns(data, settings)} />
                </div>
            </Grid>
        </MainCard>
    );
};

DataGrid.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    settings: PropTypes.object,
    onChange: PropTypes.func,
    edit: PropTypes.bool
};

export default DataGrid;
