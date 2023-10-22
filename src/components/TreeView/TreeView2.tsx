import React, { useContext } from 'react';
import { TreeItem } from '.';
import TreeNodeItem from './TreeNodeItem';
import { TreeViewSelectContext } from './TreeViewSelectContext';

interface TreeFolderItemProps {
    item: TreeItem;
    isSelected: (item: TreeItem) => boolean;
    onNodeClick?: (item: TreeItem) => any;
    onToggle: (item: TreeItem) => any;
}

const TreeFolderItem: React.FC<TreeFolderItemProps> = ({ item, isSelected, onToggle, onNodeClick }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TreeNodeItem
                item={item}
                isSelected={isSelected}
                onToggle={onToggle}
                onNodeClick={onNodeClick}
            />
            {Array.isArray(item.children) && item.children.length > 0 && item.toggled
                ? <div style={{ marginLeft: 10 }}>
                    {item.children.map((i, x) => (
                        <TreeFolderItem
                            key={`${x}_${i.id}`}
                            item={i}
                            isSelected={isSelected}
                            onToggle={onToggle}
                            onNodeClick={onNodeClick}
                        />
                    ))}
                </div>
                : null}
        </div>
    )
}

interface TreeViewRootProps {
    tree: TreeItem[];
    onNodeClick?: (item: TreeItem) => any;
    isSelected: (item: TreeItem) => boolean;
}

interface TreeViewRootState {
    tree: TreeItem[];
}

class TreeViewRoot extends React.Component<TreeViewRootProps, TreeViewRootState>{

    constructor(props: TreeViewRootProps) {
        super(props);
        this.state = {
            tree: props.tree
        }
        this.onItemToggle = this.onItemToggle.bind(this);
    }

    setStateAsync<K extends keyof TreeViewRootState>(state: Pick<TreeViewRootState, K>) {
        return new Promise<void>(resolve => this.setState(state, resolve));
    }

    mapTree(tree: TreeItem[], oldItem: TreeItem, newItem: TreeItem): TreeItem[] {
        return tree.map(i => i === oldItem
            ? newItem
            : Array.isArray(i.children)
                ? { ...i, children: this.mapTree(i.children, oldItem, newItem) }
                : i);
    }

    async replaceItem(oldItem: TreeItem, newItem: TreeItem) {
        const tree = this.mapTree(this.state.tree, oldItem, newItem);
        await this.setStateAsync({ tree });
    }

    onItemToggle(item: TreeItem) {
        const toggledItem: TreeItem = { ...item, toggled: !item.toggled };
        this.replaceItem(item, toggledItem);
    }

    render() {
        const { onNodeClick, isSelected } = this.props;
        const { tree } = this.state;
        return (
            <div>
                {tree.map((i, x) => (
                    <TreeFolderItem
                        key={`${x}_${i.id}`}
                        item={i}
                        isSelected={isSelected}
                        onToggle={this.onItemToggle}
                        onNodeClick={onNodeClick}
                    />
                ))}
            </div>
        )
    }

}

interface TreeViewProps {
    tree: TreeItem[];
    onNodeClick?: (item: TreeItem) => any;
}

const TreeView: React.FC<TreeViewProps> = ({ tree, onNodeClick }) => {
    const ctx = useContext(TreeViewSelectContext);

    function isSelected(item: TreeItem): boolean {
        return ctx.getItem() === item.id;
    }

    async function onClick(item: TreeItem) {
        if (item.id) {
            await ctx.setTreeViewItem(item.id);
        }
        onNodeClick?.call(null, item);
    }

    return (
        <TreeViewRoot
            tree={tree}
            isSelected={isSelected}
            onNodeClick={onClick}
        />
    );
}

export default TreeView;