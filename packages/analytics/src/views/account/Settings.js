import { Grid, Chip, Avatar, Card, CardHeader, Divider, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';

import { gridSpacing } from 'store/constant';
import User1 from 'assets/images/users/user-round.svg';
// assets

const Settings = () => {
    const theme = useTheme();

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={6}>
                    <Card
                        sx={{
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            ':hover': {
                                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                            }
                        }}
                    >
                        <CardHeader
                            sx={{ p: 2.5 }}
                            title={
                                <Chip
                                    sx={{
                                        height: '48px',
                                        cursor: 'pointer',
                                        '&[aria-controls="menu-list-grow"], &:hover': {
                                            borderColor: theme.palette.primary.main,
                                            background: `${theme.palette.primary.main}!important`,
                                            color: theme.palette.primary.light,
                                            '& svg': {
                                                stroke: theme.palette.primary.light
                                            }
                                        }
                                    }}
                                    icon={
                                        <Avatar
                                            src={User1}
                                            sx={{
                                                ...theme.typography.mediumAvatar,
                                                margin: '8px 0 8px 8px !important',
                                                cursor: 'pointer'
                                            }}
                                            aria-haspopup="true"
                                            color="inherit"
                                        />
                                    }
                                    label="Алексей Замаскин"
                                    variant="outlined"
                                    aria-haspopup="true"
                                    color="primary"
                                />
                            }
                        />
                        <Divider
                            sx={{
                                opacity: 1,
                                borderColor: theme.palette.primary.light
                            }}
                        />
                        <CardContent sx={{ p: 2.5 }}>123</CardContent>
                    </Card>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Settings;
