import React, { useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import ArrowDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowUpIcon from '@mui/icons-material/ArrowDropUp';

import DefaultButton from './DefaultButton';
import ErrorButton from './ErrorButton';
import SuccessButton from './SuccessButton';

export default function DropdownButton(props) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { variant, title, icon, actions = [], components = [], size } = props;
  const ButtonVariant = (variant === 'error') ? ErrorButton : (variant === 'success') ? SuccessButton : DefaultButton

  function handleToggle(event) {
    if (open) {
      setAnchorEl(null)
    } else {
      setAnchorEl(event.currentTarget);
    }
    setOpen(!open);
  };

  function handleClose(event) {
    setAnchorEl(null);
    setOpen(false);
  };

  const id = open ? 'menu-list-grow' : undefined;

  return (
    <div style={{ display: 'flex' }}>
      <ButtonVariant
        size={size}
        variant='contained'
        aria-describedby={id}
        aria-haspopup="true"
        onClick={handleToggle}>
        {icon}{icon ? ' ' : null}{title} {!open ? <ArrowDownIcon /> : <ArrowUpIcon />}
      </ButtonVariant>

      <Popper id={id} open={open} anchorEl={anchorEl} transition disablePortal placement='bottom' style={{ zIndex: 999, marginTop: 4 }}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {Array.isArray(actions) && actions.length > 0 ? actions.map((action, key) => {
                    return (
                      <MenuItem key={key} onClick={() => {
                        action.onClick();
                        setOpen(false);
                      }}>
                        {action.icon ? action.icon : null} {action.title}
                      </MenuItem>
                    )
                  }) : null}
                  {Array.isArray(components) && components.length > 0 ? components.map((Component, key) => {
                    return (
                      <MenuItem key={key} onClick={() => setOpen(false)} style={{ padding: 4 }}>
                        {Component}
                      </MenuItem>
                    )
                  }) : null}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}