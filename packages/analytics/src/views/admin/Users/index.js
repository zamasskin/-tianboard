import { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { useStoreActions } from 'easy-peasy';

import MainCard from 'ui-component/cards/MainCard';
import AccountService from 'services/AccountService';

const Users = () => {
    const checkAuth = useStoreActions((actions) => actions.account.checkAuth);
    const [rowCount, setRowCount] = useState(1);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(undefined);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(50);

    const columns = [
        { field: 'id', headerName: 'Ид' },
        { field: 'status', headerName: 'Статус' },
        { field: 'firstName', headerName: 'Имя' },
        { field: 'secondName', headerName: 'Фамилия' },
        { field: 'email', headerName: 'email' },
        { field: 'roles', headerName: 'группы' }
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

    return (
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
                />
            </div>
        </MainCard>
    );
};

export default Users;
