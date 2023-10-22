import React from 'react';
import { ContextMenuProps } from '../ContextMenu/ContextMenu';

export interface TreeItem {
    name: React.ReactNode;
    type: string;
    id: string;
    toggled?: boolean;
    children?: TreeItem[];
    contextMenu?: ContextMenuProps;
}

interface TreeViewProps {
    tree: TreeItem[];
    onNodeClick?: (item: TreeItem) => any;
}

class TreeView extends React.Component<TreeViewProps>{ }

export default TreeView;