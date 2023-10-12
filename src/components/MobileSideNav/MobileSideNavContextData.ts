export default interface MobileSideNavContextData {
    setIsMobile(isMobile: boolean): void;
    openSideNav(): void;
    closeSideNav(): void;
    isSideNavOpen: boolean;
    isMobile: boolean;
}