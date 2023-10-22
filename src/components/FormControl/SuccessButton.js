import { Button, alpha } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import { green } from "./../../themes/colors";

export default withStyles(theme => ({
    text: {
        color: green.main,
        '&:hover': {
            backgroundColor: alpha(green.main, theme.palette.action.hoverOpacity),
        }
    },
    outlined: {
        color: green.main,
        border: `1px solid ${alpha(green.main, 0.5)}`,
        '&:hover': {
            border: `1px solid ${green.main}`,
            backgroundColor: alpha(green.main, theme.palette.action.hoverOpacity),
        }
    },
    contained: {
        color: green.contrastText,
        backgroundColor: green.main,
        '&:hover': {
            backgroundColor: green.dark
        },
        '&:disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: '#999999'
        },
    }
}), { name: 'MuiButton-Success' })(Button);