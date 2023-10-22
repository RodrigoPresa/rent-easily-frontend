import { Fab } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export default withStyles(theme => ({
    root: {
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
}), { name: 'FabErrorButton' })(Fab);