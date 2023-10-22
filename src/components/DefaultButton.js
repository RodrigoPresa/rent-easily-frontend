import { alpha, Button } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export default withStyles(theme => ({
    text: {
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        }
    },
    outlined: {
        color: theme.palette.primary.main,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`,
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        }
    },
    contained: {
        color: theme.palette.primary.contrastText,
        backgroundColor: '#1e56a0',
        '&:hover': {
            backgroundColor: 'rgba(30 ,86 ,160, 0.9)'
        },
        '&:disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: '#999999'
        },
    }
}), { name: 'MuiButton-Default' })(Button);