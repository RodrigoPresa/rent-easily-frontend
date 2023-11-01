import React from 'react';
import { Theme } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

/**
 * 
 * @param {Theme} theme 
 * @returns {{[key:string]:React.CSSProperties}}
 */
function style(theme) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      paddingTop: theme.spacing(1),
      overflowY: 'auto'
    }
  }
}

const PanelBodyContent = (props) => {
  const { children, classes } = props;
  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

export default withStyles(style)(PanelBodyContent);
