import ChevronIcon from '@mui/icons-material/ChevronRight';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import makeStyles from '@mui/styles/makeStyles';
import { useSnackbar } from 'notistack';
import React, { PropsWithChildren, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RootState } from '../../reducer';
import { logoutAction } from "../../reducer/Authentication";
import { useMobileSideNav } from '../MobileSideNav/MobileSideNavContext';
import { loadingAction } from "../../reducer/loading";
import ProfileMenu from './ProfileMenu';
import { IRoutePermission } from '../../pages/system/IRoutePermissions';
import User from '../../model/User';
import { getFirstLettersToAvatar } from '../../utils/util';
import AuthService from '../../services/AuthService';
import ManagementMenu from './ManagementMenu';
import ToolsMenu from './ToolsMenu';
import DefaultButton from '../DefaultButton';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& p': {
            margin: 0
        }
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        textTransform: 'none',
        marginRight: theme.spacing(5),
    },
    header: {
        backgroundColor: '#ffffff',
        boxShadow: 'none',
        display: 'flex',
        // alignItems: 'center',
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    logo: {
        margin: theme.spacing(0, 2),
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
        width: '260px',
        //width: '25%',
        [theme.breakpoints.down('lg')]: {
            display: 'none',
        }
    },
    menuItem: {
        //height: 48,
        color: 'black'
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    fontSize35: {
        fontSize: 35
    },
    avatar: {
        margin: theme.spacing(1),
        fontSize: 22
    },
    menuContent: {
        minWidth: '200px',
        padding: theme.spacing(2),
    },
    accountLogo: {
        width: 'auto',
        height: 'auto',
        maxWidth: 180,
        maxHeight: 48
    },
    accountLogoContainer: {
        width: 180,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
        padding: '0 10px'
    },
}));

function IconAccountBox({ children }: PropsWithChildren<{}>) {
    return (
        <Box width={32} display='flex' alignItems='center' justifyContent='center'>
            {children}
        </Box>
    )
}

export interface IHeaderMenuItem {
    label: React.ReactNode;
    url: string;
}

function getMenuList(routePermissions: IRoutePermission[]): IHeaderMenuItem[] {
    var listMenus: IHeaderMenuItem[] = [];
    listMenus.push({ label: "Anúncios", url: '/system' });
    listMenus.push({ label: "Imóveis", url: '/system' });
    listMenus.push({ label: "Sobre", url: '/system' });
    listMenus.push({ label: "Ajuda", url: '/system' });

    return listMenus;
}

interface HeaderProps {
    routePermissions: IRoutePermission[]
}

interface InnerHeaderProps extends HeaderProps {
    user: User | undefined;
    profileMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
    managementMenuClick?: (event: React.MouseEvent<HTMLElement>) => void;
    toolsMenuClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

function MainMenu({ routePermissions, managementMenuClick, toolsMenuClick, onMenuClick }: MainMenuProps) {

    const classes = useStyles();
    const menus = getMenuList(routePermissions);

    const url = window.location.hash;

    return (
        <>
            {menus.map((item, i) => (
                <MenuItem
                    className={classes.menuItem}
                    key={i}
                    selected={!!(item.url && String(url).includes(item.url))}
                    onClick={onMenuClick}
                    to={item.url}
                    component={Link}>
                    {item.label}
                </MenuItem>
            ))}
        </>
    );
}

interface MainMenuProps extends HeaderProps {
    managementMenuClick?: (event: React.MouseEvent<HTMLElement>) => void;
    toolsMenuClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onMenuClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

function DesktopMainMenu({ routePermissions, managementMenuClick, toolsMenuClick }: MainMenuProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <MainMenu
                routePermissions={routePermissions}
                managementMenuClick={managementMenuClick}
                toolsMenuClick={toolsMenuClick}
            />
        </div>
    );
}

function DesktopHeader({ user, routePermissions, managementMenuClick, toolsMenuClick, profileMenuClick }: InnerHeaderProps) {

    const classes = useStyles();

    return (
        <>
            <div className={classes.logo}>
                <h1 style={{color: "black"}}>Aluga Fácil</h1>
                {/* <img alt={'Aluga Fácil'} src={''} style={{ height: 'auto', width: '100%' }} /> */}
            </div>
            <DesktopMainMenu
                routePermissions={routePermissions}
                managementMenuClick={managementMenuClick}
                toolsMenuClick={toolsMenuClick}
            />
            <HeaderAccountInfo authUser={undefined} />
            <div style={{ justifyContent: 'flex-end', alignSelf: 'center' }}>
                {
                    user ?
                        <Avatar style={{ cursor: 'pointer' }} className={classes.avatar} onClick={profileMenuClick}>
                            {getFirstLettersToAvatar(user?.fullName || "")}
                        </Avatar> :
                        <DefaultButton
                            variant="contained"
                            onClick={() => { }}
                            style={{ marginRight: 10 }}                            
                        >
                            Login
                        </DefaultButton>
                }

            </div>
        </>
    )
}

interface HeaderAccountInfoProps {
    authUser: User | undefined;
}

function HeaderAccountInfo({ authUser }: HeaderAccountInfoProps) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: 'rgba(0, 0, 0, 0.87)' }}>
            {
                <Typography variant='body1' style={{ display: 'flex', fontWeight: 500, fontSize: 20 }}>{authUser?.fullName || ""}</Typography>
            }
        </div>
    )
}

function MobileHeader({ user, profileMenuClick }: InnerHeaderProps) {

    const { hasSideNav, toggleSideNav, isSideNavOpen } = useMobileSideNav();

    return (
        <>
            {hasSideNav ?
                <IconButton
                    aria-haspopup="true"
                    onClick={toggleSideNav}
                    color="default"
                    size="large">
                    <ChevronIcon
                        style={{
                            transform: isSideNavOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.1s'
                        }}
                        fontSize='medium'
                    />
                </IconButton>
                : null
            }
            <HeaderAccountInfo authUser={user} />
            <IconButton
                aria-haspopup="true"
                onClick={profileMenuClick}
                color="default"
                size="large">
                <MoreIcon fontSize='medium' />
            </IconButton>
        </>
    )
}

function Header({ routePermissions }: HeaderProps) {

    const { enqueueSnackbar } = useSnackbar();

    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [managementAnchorEl, setManagementAnchorEl] = React.useState<null | HTMLElement>(null);
    const [toolsAnchorEl, setToolsAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuManagementOpen = (event: React.MouseEvent<HTMLElement>) => {
        setManagementAnchorEl(event.currentTarget);
    };
    const handleMenuToolsOpen = (event: React.MouseEvent<HTMLElement>) => {
        setToolsAnchorEl(event.currentTarget);
    };

    const handleMenuManagementClose = () => {
        setManagementAnchorEl(null);
    };
    const handleMenuToolsClose = () => {
        setToolsAnchorEl(null);
    };

    const dispatch = useDispatch();
    // const { authUser, loggedIn } = useSelector(mapStateToProps);
    const authUser = undefined;

    const classes = useStyles();

    function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
        setUserMenuAnchorEl(event.currentTarget);
    }

    function handleProfileMenuClose() {
        setUserMenuAnchorEl(null);
    }

    function loading(value: boolean) {
        dispatch(loadingAction(value));
    }

    async function logOut() {
        loading(true);
        await AuthService.instance.logout();
        loading(false);
        dispatch(logoutAction());
    }

    const isMenuOpen = Boolean(userMenuAnchorEl);

    //if (!authUser) return null;

    return (
        <div className={classes.root} >
            <AppBar position="static" className={classes.header}>
                <Toolbar className={classes.toolbar}>

                    <BrowserView style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                        <DesktopHeader
                            user={authUser}
                            routePermissions={routePermissions}
                            managementMenuClick={handleMenuManagementOpen}
                            toolsMenuClick={handleMenuToolsOpen}
                            profileMenuClick={handleProfileMenuOpen}
                        />
                        <ProfileMenu
                            authUser={authUser}
                            isOpen={isMenuOpen}
                            anchorEl={userMenuAnchorEl}
                            onClose={handleProfileMenuClose}
                            onLogOut={logOut}
                        />
                    </BrowserView>

                    <MobileView style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                        <MobileHeader
                            user={authUser}
                            routePermissions={routePermissions}
                            profileMenuClick={handleProfileMenuOpen}
                        />
                        <ProfileMenu
                            authUser={authUser}
                            isOpen={isMenuOpen}
                            anchorEl={userMenuAnchorEl}
                            onClose={handleProfileMenuClose}
                            onLogOut={logOut}
                        >
                            <Divider />
                            <MainMenu
                                routePermissions={routePermissions}
                                managementMenuClick={handleMenuManagementOpen}
                                toolsMenuClick={handleMenuToolsOpen}
                                onMenuClick={handleProfileMenuClose}
                            />
                            <Divider />
                        </ProfileMenu>
                    </MobileView>

                </Toolbar>
            </AppBar>
        </div>
    );

}

function mapStateToProps(state: RootState) {
    const { loggedIn, authUser } = state.authentication;
    return {
        loggedIn,
        authUser
    };
}

export default Header;