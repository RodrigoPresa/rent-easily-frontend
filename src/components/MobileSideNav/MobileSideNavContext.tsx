import React from 'react';

export interface MobileSideNavContextData {
    hasSideNav: boolean;
    setHasSideNav(hasSideNav: boolean): void;

    isSideNavOpen: boolean;
    openSideNav(): void;
    closeSideNav(): void;
    toggleSideNav(): void;

    isMobile: boolean;
}

const MobileSideNavContext = React.createContext<MobileSideNavContextData>({
    hasSideNav: false,
    setHasSideNav: (hasSideNav: boolean) => { },

    isSideNavOpen: false,    
    openSideNav: () => { },
    closeSideNav: () => { },
    toggleSideNav: () => { },

    isMobile: false
});

export function useMobileSideNav() {
    return React.useContext(MobileSideNavContext);
}

export default MobileSideNavContext;

