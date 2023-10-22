import { ClickAwayListener, Divider, Slide, Typography } from '@mui/material';
import List from '@mui/material/List';
import { makeStyles } from '@mui/styles';
import React, { PropsWithChildren, useEffect } from 'react';
import { MenuItem } from '.';
import TreeView from '../../components/TreeView';
import { useMobileSideNav } from '../MobileSideNav/MobileSideNavContext';
import { TreeItem } from '../TreeView';

const useStyles = makeStyles(theme => ({
    'root': {
        height: '100%',
        overflowY: 'auto',
        backgroundColor: theme.palette.background.paper,
    },
    'subheader': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    'buttons': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    'parentLink': {
        paddingTop: 2,
        paddingBottom: 2
    },
    'nested': {
        paddingLeft: theme.spacing(4),
        paddingTop: 2,
        paddingBottom: 2
    },
    'nestedIcon': {
        marginRight: 0,
    },
}));

interface SideNavProps {
    title?: string;
    headerButton?: any;
    inputSearch?: any;
    tree: TreeItem[];
    onNodeClick?: (item: TreeItem) => void;
}

const SideNavContent = React.forwardRef((props: SideNavProps, ref: React.Ref<HTMLElement>) => {

    const { title, headerButton, tree, onNodeClick, inputSearch } = props;

    const classes = useStyles();

    return (
        <List ref={ref} component="nav" className={classes.root} disablePadding>
            <div className={classes.subheader}>
                {title && <Typography align='center' variant="h6" style={{ lineHeight: '2.16667em', width: '100%' }}> {title} </Typography>}
            </div>

            <div className={classes.buttons}>
                {headerButton}
            </div>
            {headerButton ? (<Divider />) : (null)}

            {inputSearch}
            {inputSearch ? (<Divider />) : (null)}

            <div style={{ padding: '0px 10px' }}>
                <TreeView tree={tree} onNodeClick={onNodeClick} />
            </div>
        </List>
    );
});

const SideNavSize = 320;

interface SideNavContainerProps {
    children: React.ReactElement
}

export function MobileSideNavContainer({ children }: SideNavContainerProps) {

    const { isSideNavOpen, closeSideNav } = useMobileSideNav();

    return (
        <div
            style={{
                position: 'absolute',
                zIndex: 100,
                height: '100%',
                display: 'flex',
                maxWidth: '90%',
                flexDirection: 'row'
            }}
        >
            <Slide
                in={isSideNavOpen}
                direction="right"
                timeout={100}
                appear={false}
                mountOnEnter
                unmountOnExit
            >
                <div style={{
                    width: SideNavSize,
                    maxWidth: '100%',
                    boxShadow: '2px 0px 5px 0px rgba(0,0,0,0.75)',
                }}>
                    <ClickAwayListener onClickAway={closeSideNav}>
                        {children}
                    </ClickAwayListener>
                </div>
            </Slide>
        </div >
    )
};

export function DesktopSideNavContainer({ children }: SideNavContainerProps) {
    return (
        <div style={{ width: SideNavSize }}>
            {children}
        </div>
    );
}

export function SideNavContainer({ children }: SideNavContainerProps) {

    const { isMobile, setHasSideNav } = useMobileSideNav();

    useEffect(() => {
        setHasSideNav(true);
        return () => {
            setHasSideNav(false);
        };
    }, [setHasSideNav]);

    const Container = isMobile ? MobileSideNavContainer : DesktopSideNavContainer;

    return (
        <Container>
            {children}
        </Container>
    );
}

export default function SideNav({ onNodeClick, ...rest }: SideNavProps) {

    const { isMobile, closeSideNav } = useMobileSideNav();

    function handleNodeClick(item: MenuItem) {
        if (isMobile) {
            closeSideNav();
        }
        onNodeClick?.call(null, item);
    }

    return (
        <SideNavContainer>
            <SideNavContent {...rest} onNodeClick={handleNodeClick} />
        </SideNavContainer>
    );
}