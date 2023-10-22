import React from 'react';

interface TreeViewSelectContextData {
    setTreeViewItem: (id: string | null) => Promise<any>,
    removeTreeViewItem: (id: string) => Promise<any>,
    getItem: () => string | null
}

const TreeViewSelectContext = React.createContext<TreeViewSelectContextData>({
    setTreeViewItem: async (id) => { },
    removeTreeViewItem: async (id) => { },
    getItem: () => null
});

function withTreeViewSelect<P = {}>(Component: React.ComponentType<P & TreeViewSelectContextData>): React.FC<P> {
    return (props) => (
        <TreeViewSelectContext.Consumer>
            {(contextProps) => (
                <Component {...contextProps} {...props as React.PropsWithChildren<P>} />
            )}
        </TreeViewSelectContext.Consumer>
    );
}

export {
    TreeViewSelectContext,
    withTreeViewSelect
};
