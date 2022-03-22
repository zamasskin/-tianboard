import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStoreActions } from 'easy-peasy';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
    Badge,
    Stack,
    IconButton
} from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

import TaskService from 'services/TaskService';

const ActionTools = () => (
    <>
        <Stack direction="row" spacing={2}>
            <IconButton>
                <Badge badgeContent={10} color="primary">
                    <ErrorIcon />
                </Badge>
            </IconButton>

            <IconButton>
                <Badge badgeContent={2} color="error">
                    <WarningIcon color="error" />
                </Badge>
            </IconButton>
        </Stack>
    </>
);

const Tasks = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [rowCount, setRowCount] = useState(1);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(undefined);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(50);
    const [selectionModel, setSelectionModel] = useState([]);
    const [open, setOpen] = useState(false);

    const loadTasks = async (where = {}) => {
        setError(false);
        setLoading(false);

        try {
            const response = await TaskService.findMany({
                where,
                perPage: pageSize,
                currentPage: page + 1
            });
            const { count, data } = response.data;
            setRowCount(count);
            setRows(data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    };

    const openEdit = () => {
        const [id] = selectionModel;
        navigate([location.pathname, id].join('/'));
    };

    const deleteTask = async () => {
        setError(false);
        setOpen(false);
        try {
            const id = _.first(selectionModel);
            await TaskService.delete(id);
            await loadTasks();
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => {
        loadTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    const Toolbar = () => (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={() => navigate([location.pathname, 'new'].join('/'))}>
                Создать
            </Button>
            {selectionModel.length > 0 && (
                <>
                    <Button color="primary" startIcon={<EditIcon />} onClick={openEdit}>
                        Редактировать
                    </Button>
                    <Button color="primary" startIcon={<DeleteForeverIcon />} onClick={() => setOpen(true)}>
                        Удалить
                    </Button>
                </>
            )}
        </GridToolbarContainer>
    );

    const columns = [
        { field: 'id', headerName: 'Ид', width: 40 },
        { field: 'name', headerName: 'Название', width: 150 },
        { field: 'recurrent', headerName: 'Переодический', width: 140 },
        { field: 'dateStart', headerName: 'Дата запуска', width: 120 },
        { field: 'cronExpression', headerName: 'Выражение cron', width: 150 },
        { field: 'action', headerName: 'Действие', width: 100 },
        { field: 'actionId', headerName: 'Ид действия', width: 120 }
    ];

    return (
        <>
            <MainCard title="Задачи" secondary={<ActionTools />}>
                <div style={{ height: 500 }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        rowCount={rowCount}
                        loading={loading}
                        page={page}
                        rowsPerPageOptions={[20, 50, 100, 500]}
                        onPageChange={(nextPage) => setPage(nextPage)}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        onSelectionModelChange={setSelectionModel}
                        selectionModel={selectionModel}
                        components={{ Toolbar }}
                        onCellDoubleClick={openEdit}
                    />
                </div>
            </MainCard>
            <Dialog open={open} keepMounted onClose={() => setOpen(false)} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>Вы уверены?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">Удаление подключения не затрагивает данные!</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                    <Button onClick={deleteTask}>Удалить</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(false)}
                // anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Tasks;
