import React from 'react';
import { TreeViewSelectContext } from './TreeViewSelectContext';

interface TreeViewSelectProviderProps {
    children?: React.ReactNode
}

interface TreeViewSelectProviderState {
    selectedItem: string | null;
}

export default class TreeViewSelectProvider extends React.Component<TreeViewSelectProviderProps, TreeViewSelectProviderState> {

    constructor(props: TreeViewSelectProviderProps) {
        super(props);
        this.state = {
            selectedItem: null
        }
        this.getItem = this.getItem.bind(this);
        this.setTreeViewItem = this.setTreeViewItem.bind(this);
        this.removeTreeViewItem = this.removeTreeViewItem.bind(this);
    }

    setStateAsync<K extends keyof TreeViewSelectProviderState>(state: Pick<TreeViewSelectProviderState, K>) {
        return new Promise<void>(resolve => this.setState(state, resolve));
    }

    getItem() {
        return this.state.selectedItem;
    }

    async setTreeViewItem(selectedItem: string | null) {
        await this.setStateAsync({ selectedItem });
    }

    async removeTreeViewItem(id: string) {
        if (id === this.state.selectedItem) {
            await this.setStateAsync({ selectedItem: null });
        }
    }

    render() {
        const { children } = this.props;
        return (
            <TreeViewSelectContext.Provider value={{ getItem: this.getItem, setTreeViewItem: this.setTreeViewItem, removeTreeViewItem: this.removeTreeViewItem }}>
                {children}
            </TreeViewSelectContext.Provider>
        );
    }

}