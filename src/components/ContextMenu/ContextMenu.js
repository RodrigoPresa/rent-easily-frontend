import React from 'react';
import { ContextMenuContext } from "./ContextMenuProvider";

export default function ContextMenu({ children, menu, data }) {
    return (
        <ContextMenuContext.Consumer>
            {({ showMenu }) => (
                <div onContextMenu={(ev) => {
                    if (ev.target !== null) {
                        ev.preventDefault();
                        showMenu({ menu, data, mouseX: ev.clientX, mouseY: ev.clientY });
                    }
                }}>
                    <span style={{ cursor: 'context-menu' }}>
                        {children}
                    </span>
                </div>
            )}
        </ContextMenuContext.Consumer>
    )
}