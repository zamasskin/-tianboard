import { Link } from 'react-router-dom';
import { Grid, Box, Typography, Stack } from '@mui/material';

import AuthCardWrapper from 'views/pages/authentication/AuthCardWrapper';
import AuthWrapper1 from 'views/pages/authentication/AuthWrapper1';
import Logo from 'ui-component/Logo';
import CreateConnectionForm from 'views/forms/CreateConnectionForm';

function CreateDatabase() {
    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography variant="h3">Настройка подключения</Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <Box>
                                                    <CreateConnectionForm />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
}

export default CreateDatabase;
