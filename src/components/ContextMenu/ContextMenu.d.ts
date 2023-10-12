import React from 'react';

export interface ContextMenuItem {
    name: string;
    icon?: React.ReactNode;
    onClick: (data?: any) => void;
}

export interface ContextMenuProps {
    menu: ContextMenuItem[];
    data?: any;
}

export default class ContextMenu extends React.Component<ContextMenuProps>{ }