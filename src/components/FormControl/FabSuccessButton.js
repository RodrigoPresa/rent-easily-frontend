import { Fab } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import { green } from "../../themes/colors";

export default withStyles(theme => ({
    root: {
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
}), { name: 'FabSuccessButton' })(Fab);