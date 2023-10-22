import { Button, alpha } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export default withStyles(theme => ({
    text: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, theme.palette.action.hoverOpacity),
        }
    },
    outlined: {
        color: theme.palette.error.main,
        border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
        '&:hover': {
            border: `1px solid ${theme.palette.error.main}`,
            backgroundColor: alpha(theme.palette.error.main, theme.palette.action.hoverOpacity),
        }
    },
    contained: {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        },
        '&:disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: '#999999'
        },
    }

}), { name: 'MuiButton-Error' })(Button);