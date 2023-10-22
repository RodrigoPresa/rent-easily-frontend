import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { TreeItem } from '.';
import nbsp from '../nbsp';
import NodeToggle from './NodeToggle';
import TreeNodeHeader from './TreeNodeHeader';

interface TreeNodeItemProps {
    item: TreeItem;
    isSelected: (item: TreeItem) => boolean;
    onNodeClick?: (item: TreeItem) => any;
    onToggle: (item: TreeItem) => any;
}

const useStyles = makeStyles({
    root: {
        cursor: 'pointer',
        position: 'relative',
        padding: 0,
        paddingLeft: 16,
        display: 'flex',
        alignItems: 'center',
        height: 20,
        '&:hover': {
            backgroundColor: '#dfdfdf'
        },
    },
    fakeToggle: {
        height: 16,
        width: 16
    }
}, { name: 'TreeNodeItem' });

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({ item, isSelected, onNodeClick, onToggle }) => {
    const classes = useStyles();
    const selected = isSelected(item);
    const children = item.children;
    return (
        <div
            className={classes.root}
            style={selected ? { backgroundColor: '#cfebff', fontWeight: 600 } : {}}
        >
            {Array.isArray(children) && children.length > 0
                ? <NodeToggle item={item} onToggle={onToggle} />
                : <div className={classes.fakeToggle} >{nbsp}</div>}
            <TreeNodeHeader item={item} onNodeClick={onNodeClick} onDoubleClick={onToggle} />
        </div >
    );
}

export default TreeNodeItem;