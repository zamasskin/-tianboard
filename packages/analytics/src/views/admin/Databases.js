import _ from 'lodash';
import { useState } from 'react';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { Button, Alert, Modal, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar } from '@mui/material';
import { useStoreActions } from 'easy-peasy';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import MainCard from 'ui-component/cards/MainCard';

import ConnectionService from 'services/ConnectionService';
import CreateConnectionForm from 'ui-component/forms/CreateConnectionForm';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

const Databases = () => {
    const checkAuth = useStoreActions((actions) => actions.account.checkAuth);
    const [connections, setConnections] = useState([]);
    const [error, setError] = useState(false);
    const columns = [
        { field: 'contextName', headerName: 'Ид', width: 250 },
        { field: 'connectionName', headerName: 'Название', width: 300 },
        { field: 'type', headerName: 'Тип подключения', width: 300 }
    ];

    const [open, setOpen] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);

    async function loadDatabase() {
        try {
            const { data } = await ConnectionService.list();
            setConnections(data.map((data) => ({ ...data, id: data.contextName })));
        } catch (e) {
            setError(e.message);
        }
    }

    useState(async () => {
        loadDatabase();
    }, []);

    const onSubmitCreate = async (form, { setErrors, setSubmitting }) => {
        try {
            const { formType, ...params } = form;
            await checkAuth();
            if (formType === 'file') {
                await ConnectionService.createFile(params);
            } else if (formType === 'url') {
                await ConnectionService.createUrl(params);
            } else {
                await ConnectionService.create(params);
            }
            await loadDatabase();
            setOpenModalCreate(false);
        } catch (e) {
            setErrors({ submit: e?.response?.data?.message || e.message });
        } finally {
            setSubmitting(false);
        }
    };

    const onSubmitUpdate = async (form, { setErrors, setSubmitting }) => {
        console.log(form);
    };

    const deleteConnection = async () => {
        setOpen(false);
        try {
            await checkAuth();
            const id = _.first(selectionModel);
            await ConnectionService.delete(id);
            setConnections(connections.filter((conn) => conn.id !== id));
            setSelectionModel([]);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <MainCard>
                <div style={{ height: 500 }}>
                    <DataGrid
                        columns={columns}
                        rows={connections}
                        selectionModel={selectionModel}
                        onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                        components={{
                            Toolbar: () => (
                                <GridToolbarContainer>
                                    <Button color="primary" startIcon={<AddIcon />} onClick={() => setOpenModalCreate(true)}>
                                        Создать
                                    </Button>
                                    {selectionModel.length > 0 && _.first(selectionModel) !== 'default' && (
                                        <>
                                            <Button color="primary" startIcon={<EditIcon />} onClick={() => setOpenModalUpdate(true)}>
                                                Редактировать
                                            </Button>
                                            <Button color="primary" startIcon={<DeleteForeverIcon />} onClick={handleClickOpen}>
                                                Удалить
                                            </Button>
                                            <Dialog
                                                open={open}
                                                keepMounted
                                                onClose={handleClose}
                                                aria-describedby="alert-dialog-slide-description"
                                            >
                                                <DialogTitle>Вы уверены?</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-slide-description">
                                                        Удаление подключения не затрагивает данные!
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleClose}>Отмена</Button>
                                                    <Button onClick={deleteConnection}>Удалить</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </>
                                    )}
                                </GridToolbarContainer>
                            )
                        }}
                    />
                </div>
            </MainCard>
            <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
                <Box sx={style}>
                    <CreateConnectionForm onSubmit={onSubmitCreate} submitName="Создать" />
                </Box>
            </Modal>
            <Modal open={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
                <Box sx={style}>
                    <CreateConnectionForm onSubmit={onSubmitUpdate} submitName="Изменить" />
                </Box>
            </Modal>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Databases;
