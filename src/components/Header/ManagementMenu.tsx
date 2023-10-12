import { ClickAwayListener, Grow, MenuList, Paper, Popper } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Link } from "react-router-dom";
import { IHeaderMenuItem } from './Header';

interface ManagementMenuProps {
    isOpen: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => any;
    menusManagement: IHeaderMenuItem[];
}

const useStyles = makeStyles((theme) => ({
    menuContent: {
        minWidth: '150px',
        padding: 0,
    }
}));

function ManagementMenu(props: ManagementMenuProps) {
    const { onClose, isOpen, anchorEl, menusManagement } = props;

    const classes = useStyles();
    const url = window.location.hash;
    return (
        <Popper open={isOpen} anchorEl={anchorEl} transition style={{ zIndex: 9999 }}>
            {({ TransitionProps, placement }) => (
                <ClickAwayListener onClickAway={onClose}>
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper className={classes.menuContent}>
                            <MenuList style={{ padding: 0 }}>
                                {menusManagement.map((item, i) => (
                                    <MenuItem
                                        key={i}
                                        selected={!!(item.url && String(url).includes(item.url))}
                                        onClick={onClose}
                                        to={item.url}
                                        component={Link}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Paper>
                    </Grow>
                </ClickAwayListener>
            )}
        </Popper>
    )
}

export default ManagementMenu;