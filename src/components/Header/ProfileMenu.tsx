import { ExitToApp } from '@mui/icons-material/';
import { Avatar, Box, ClickAwayListener, Divider, Grow, ListItemIcon, MenuList, Paper, Popper, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import React, { PropsWithChildren } from 'react';
import User from '../../model/User';
import { getFirstLettersToAvatar } from '../../utils/util';

interface ProfileMenuProps {
    authUser: User | undefined;
    isOpen: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => any;
    onLogOut: () => any;
}

const useStyles = makeStyles((theme) => ({
    menuContent: {
        minWidth: '200px',
        padding: theme.spacing(2),
    },
    avatar: {
        margin: theme.spacing(1),
        fontSize: 22
    }
}));

function ProfileMenu(props: PropsWithChildren<ProfileMenuProps>) {
    const { authUser, isOpen, anchorEl, onClose, onLogOut, children } = props;

    const classes = useStyles();

    return (
        <Popper open={isOpen} anchorEl={anchorEl} transition style={{ zIndex: 9999 }}>
            {({ TransitionProps, placement }) => (
                <ClickAwayListener onClickAway={onClose}>
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper className={classes.menuContent}>
                            <>
                                <Box display='flex' justifyContent="center" alignItems="center">
                                    <Avatar className={classes.avatar}>{getFirstLettersToAvatar(authUser?.fullName || "")}</Avatar>
                                </Box>
                                <Box display='flex' justifyContent="center" alignItems="center">
                                    <Typography align='center'>{authUser?.fullName  || ""}</Typography>
                                </Box>
                                <MenuList>
                                    {children}
                                    <MenuItem onClick={onLogOut}>
                                        <ListItemIcon style={{ minWidth: 25 }}>
                                            <ExitToApp />
                                        </ListItemIcon>
                                        Sair
                                    </MenuItem>
                                </MenuList>
                            </>
                        </Paper>
                    </Grow>
                </ClickAwayListener>
            )}
        </Popper>
    )
}

export default ProfileMenu;