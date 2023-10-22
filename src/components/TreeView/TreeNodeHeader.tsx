import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { TreeItem } from '.';
import EnumTypeIcon from './EnumTypeIcon';
import TreeNodeName from './TreeNodeName';

interface TreeNodeHeaderProps {
    item: TreeItem;
    onNodeClick?: (item: TreeItem) => any;
    onDoubleClick?: (item: TreeItem) => any;
}

const useStyles = makeStyles({
    root: {
        verticalAlign: 'top',
        color: 'rgba(0, 0, 0, 0.87)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        flex: 1
    },
    container: {
        display: 'flex',
        alignItems: 'center'
    }
}, { name: 'TreeNodeHeader' });

const TreeNodeHeader: React.FC<TreeNodeHeaderProps> = ({ item, onNodeClick, onDoubleClick }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}
            onClick={() => onNodeClick?.call(null, item)}
            onDoubleClick={() => onDoubleClick?.call(null, item)}
        >
            <div className={classes.container}>
                <EnumTypeIcon type={item.type} />
                <TreeNodeName>{item.name}</TreeNodeName>
            </div>
        </div>
    );
}

export default TreeNodeHeader;