import React, { PropsWithChildren, useState } from 'react';
import { isMobile } from 'react-device-detect';
import MobileSideNavContext from './MobileSideNavContext';

export default function MobileSideNavContextProvider({ children }: PropsWithChildren<{}>) {

    const [isSideNavOpen, setSideNavOpen] = useState<boolean>(false);
    const [hasSideNav, setHasSideNav] = useState<boolean>(false);

    function toggleSideNav() {
        setSideNavOpen(!isSideNavOpen);
    }

    function openSideNav() {
        setSideNavOpen(true);
    }

    function closeSideNav() {
        setSideNavOpen(false);
    }

    return (
        <MobileSideNavContext.Provider
            value={{
                isMobile,
                isSideNavOpen,
                toggleSideNav,
                openSideNav,
                closeSideNav,
                hasSideNav,
                setHasSideNav
            }}
        >
            {children}
        </MobileSideNavContext.Provider>
    )
}