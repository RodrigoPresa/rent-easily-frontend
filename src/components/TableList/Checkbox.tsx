
import MuiCheckbox from '@mui/material/Checkbox';
import withStyles from '@mui/styles/withStyles';

export default withStyles((theme) => ({
    root: {
        padding: 0,
        fontSize: '1.2rem',
        display: 'flex'
    }
}), { name: 'Checkbox' })(MuiCheckbox)