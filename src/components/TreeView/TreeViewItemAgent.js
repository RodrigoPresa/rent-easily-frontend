import React from 'react';
import { withTreeViewSelect } from './TreeViewSelectContext';

class TreeViewItemAgent extends React.Component {

    async componentDidMount() {
        const { setTreeViewItem, id } = this.props;
        await setTreeViewItem(id);
    }

    async componentWillUnmount() {
        const { removeTreeViewItem, id } = this.props;
        await removeTreeViewItem(id);
    }

    async componentDidUpdate(prevProps, prevState) {
        const { setTreeViewItem, removeTreeViewItem, id } = this.props;
        if (prevProps.id !== id) {
            await removeTreeViewItem(prevProps.id);
            await setTreeViewItem(id);
        }
    }

    render() {
        return null;
    }

}

export default withTreeViewSelect(TreeViewItemAgent);