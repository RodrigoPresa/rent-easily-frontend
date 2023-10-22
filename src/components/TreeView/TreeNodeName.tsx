import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        fontSize: 14,
        userSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: '-moz-none',
        WebkitUserSelect: 'none',
        '& a:visited, & a:hover, & a:link': {
            color: 'inherit',
            textDecoration: 'none'
        }
    }
}, { name: 'TreeNodeName' });

const TreeNodeName: React.FC = ({ children }) => {
    const classes = useStyles();
    return <span className={classes.root}>{children}</span>
}

export default TreeNodeName;