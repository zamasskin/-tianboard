import { useEffect, useState } from 'react';
import { Button, Modal, Box } from '@mui/material';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { useStoreActions } from 'easy-peasy';

import MainCard from 'ui-component/cards/MainCard';
import AccountService from 'services/AccountService';
import CreateUserForm from 'ui-component/forms/Account/CreateUserForm';

import AddIcon from '@mui/icons-material/Add';

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

const Users = () => {
    const checkAuth = useStoreActions((actions) => actions.account.checkAuth);
    const [rowCount, setRowCount] = useState(1);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(undefined);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(50);
    const [selectionModel, setSelectionModel] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    const columns = [
        { field: 'id', headerName: 'Ид', width: 40 },
        { field: 'status', headerName: 'Статус', width: 100 },
        { field: 'firstName', headerName: 'Имя', width: 100 },
        { field: 'secondName', headerName: 'Фамилия', width: 100 },
        { field: 'email', headerName: 'email', width: 200 },
        { field: 'roles', headerName: 'группы', width: 200 }
    ];

    const loadUsers = async () => {
        setLoading(true);
        try {
            await checkAuth();
            const response = await AccountService.findMany({
                where: {},
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

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    const Toolbar = () => (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={() => setOpenModalCreate(true)}>
                Создать
            </Button>
        </GridToolbarContainer>
    );

    const onSubmit = async (form, { setErrors, setSubmitting }) => {
        try {
            await checkAuth();
            await AccountService.create(form);
            await loadUsers();
            setOpenModalCreate(false);
        } catch (e) {
            setErrors({ submit: e?.response?.data?.message || e.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <MainCard>
                <div style={{ height: 500 }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        rowCount={rowCount}
                        loading={loading}
                        page={page}
                        rowsPerPageOptions={[20, 50, 100, 500]}
                        onPageChange={(nextPage) => setPage(nextPage)}
                        error={error}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        onSelectionModelChange={setSelectionModel}
                        selectionModel={selectionModel}
                        components={{ Toolbar }}
                    />
                </div>
            </MainCard>
            <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
                <Box sx={style}>
                    <CreateUserForm btnName="Создать" roles={[]} cancelBtn onSubmit={onSubmit} onCancel={() => setOpenModalCreate(false)} />
                </Box>
            </Modal>
        </>
    );
};

export default Users;
