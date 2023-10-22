import React from 'react';
import { ContextMenuItem } from '../ContextMenu/ContextMenu';

export interface MenuItem {
    name: React.ReactNode;
    type: string;
    id: string;
    toggled?: Boolean;
    children?: MenuItem[];
    contextMenu?: ContextMenuItem[];
}

interface SideNavProps {
    title?: string;
    headerButton?: any;
    inputSearch?: any;
    tree: MenuItem[];
    onNodeClick?: (item: MenuItem) => void;
}

declare class SideNav extends React.Component<SideNavProps>{ }

export default SideNav;