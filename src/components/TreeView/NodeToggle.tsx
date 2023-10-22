import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { TreeItem } from '.';

const useStyles = makeStyles({
    root: {
        height: 16,
        width: 16
    },
}, { name: 'NodeToggle' });

interface NodeToggleProps {
    item: TreeItem;
    onToggle: (item: TreeItem) => any;
}

const NodeToggle: React.FC<NodeToggleProps> = ({ item, onToggle }) => {
    const classes = useStyles();
    const content = !!item.toggled ? <ExpandMore fontSize='small' /> : <ChevronRight fontSize='small' />;
    return <div className={classes.root} onClick={() => onToggle(item)}>{content}</div>;
};

export default NodeToggle;