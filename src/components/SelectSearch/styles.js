import { emphasize } from '@mui/material/styles';

/**
 * 
 * @param {import('@mui/material').Theme} theme 
 * @returns {import('@mui/styles').CreateCSSProperties}
 */
const styles = theme => ({
    // root: {
    //     flexGrow: 1,
    // },
    input: {
        display: 'flex',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: theme.spacing(1, 2),
    },
    singleValue: {
        fontSize: 14,
    },
    placeholder: {
        fontSize: 14,
    },
    paper: {
        /*position: 'absolute',
        zIndex: 999,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,*/
    },
    divider: {
        height: theme.spacing(4),
    },
});

export default styles;