import React from 'react';
import { withStyles } from '@mui/styles';
import { ContextMenuItem, ContextMenuProps } from './ContextMenu';
import { ClickAwayListener } from '@mui/material';

interface ShowMenuParams extends ContextMenuProps {
    mouseX: number | null;
    mouseY: number | null;
}

export const ContextMenuContext = React.createContext({
    showMenu: ({ menu, data, mouseX, mouseY }: ShowMenuParams) => { console.log(menu, data, mouseX, mouseY) }
});

interface MenuProps {
    classes: Record<"container" | "menu" | "menuItem" | "menuItemIcon", string>;
    menu: ContextMenuItem[],
    data: any[],
    mouseX: number | null;
    mouseY: number | null;
    menuClick: () => void;
}

const Menu = withStyles({
    'container': {
        position: 'absolute',
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
        color: 'rgba(0, 0, 0, 0.87)',
        transition: 'box - shadow 300ms cubic- bezier(0.4, 0, 0.2, 1) 0ms',
        backgroundColor: '#fff',
        padding: '0px 0px',
        borderRadius: 4,
        zIndex: 9999
    },
    'menu': {
        padding: 0,
        margin: '0px 0px'
    },
    'menuItem': {
        minWidth: 200,
        width: 'auto',
        textDecoration: 'none',
        listStyle: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '4px 12px',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)'
        }
    },
    'menuItemIcon': {
        marginRight: 4
    }
})(({ classes, menu, data, mouseX, mouseY, menuClick }: MenuProps) => {
    return (
        <ClickAwayListener onClickAway={menuClick}>
            <div className={classes.container} style={{ left: mouseX || undefined, top: mouseY || undefined }}>
                <ul className={classes.menu}>
                    {menu.map(({ name, icon, onClick }, i) => (
                        <li className={classes.menuItem} key={i} onClick={() => { menuClick(); onClick(data); }}>
                            {icon ? <span className={classes.menuItemIcon}>{icon}</span> : null}
                            {name}
                        </li>
                    ))}
                </ul>
            </div>
        </ClickAwayListener>
    );
})

interface ContextMenuProviderProps {

}

interface ContextMenuProviderState extends ShowMenuParams {
    show: boolean;    
}

export class ContextMenuProvider extends React.Component<ContextMenuProviderProps, ContextMenuProviderState> {

    constructor(props: ContextMenuProviderProps) {
        super(props);
        this.state = {
            show: false,
            menu: [],
            data: null,
            mouseX: null,
            mouseY: null
        }
        this.menuClick = this.menuClick.bind(this);
        this.showMenu = this.showMenu.bind(this);
    }

    showMenu({ menu, data, mouseX, mouseY }: ShowMenuParams) {
        this.setState({
            show: true,
            menu, data, mouseX, mouseY
        });
    }

    menuClick() {
        this.setState({
            show: false,
            menu: [], data: null, mouseX: null, mouseY: null
        });
    }

    render() {
        const { children } = this.props;
        const { show, menu, data, mouseX, mouseY } = this.state;
        return (
            <ContextMenuContext.Provider value={{ showMenu: this.showMenu }}>
                <>
                    {show ? <Menu {...{ menu, data, mouseX, mouseY }} menuClick={this.menuClick} /> : null}
                    {children}
                </>
            </ContextMenuContext.Provider>
        );
    }
}