import { useTheme, styled } from '@mui/material/styles';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Grid, Typography, ListItemSecondaryAction, Chip } from '@mui/material';

import { IconSubtask } from '@tabler/icons';

const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

const NotificationList = () => {
    const theme = useTheme();

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };

    const listStyleSx = {
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
            maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
            top: 22
        },
        '& .MuiDivider-root': {
            my: 0
        },
        '& .list-container': {
            pl: 7
        }
    };

    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.orange.light,
        marginRight: '5px'
    };

    return (
        <List sx={listStyleSx}>
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: theme.palette.success.dark,
                                backgroundColor: theme.palette.success.light,
                                border: 'none',
                                borderColor: theme.palette.success.main
                            }}
                        >
                            <IconSubtask stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Store Verification Done</Typography>} />
                    <ListItemSecondaryAction>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom>
                                    2 min ago
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">We have successfully received your request.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                                <Chip label="Unread" sx={chipErrorSX} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItemWrapper>
        </List>
    );
};

export default NotificationList;
