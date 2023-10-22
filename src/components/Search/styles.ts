import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    'search': {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    'searchIcon': {
        width: theme.spacing(6),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    'inputRoot': {
        alignItems: 'center',
        color: 'inherit',
        width: '100%',
        border: '1px solid #031527',
        marginLeft: 0
    },
    'inputInput': {
        transition: theme.transitions.create('width'),
        width: '100%',
        padding: theme.spacing(1)
    },
}));

export default useStyles;