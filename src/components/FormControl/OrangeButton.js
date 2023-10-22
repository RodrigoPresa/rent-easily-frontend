import { Button, alpha } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import { orange } from "../../themes/colors";
export default withStyles(theme => ({
    text: {
        color: orange.main,
        '&:hover': {
            backgroundColor: alpha(orange.main, theme.palette.action.hoverOpacity),
        }
    },
    outlined: {
        color: orange.main,
        border: `1px solid ${alpha(orange.main, 0.5)}`,
        '&:hover': {
            border: `1px solid ${orange.main}`,
            backgroundColor: alpha(orange.main, theme.palette.action.hoverOpacity),
        }
    },
    contained: {
        color: orange.contrastText,
        backgroundColor: orange.main,
        '&:hover': {
            backgroundColor: orange.dark
        },
        '&:disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: '#999999'
        },
    }
}), { name: 'MuiButton-Orange' })(Button);