import React, { PropsWithChildren, Suspense, useEffect } from 'react';
import { BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import User from '../../model/User';
import { IRoutePermission } from './IRoutePermissions';
import { logoutAction, useAuthentication } from '../../reducer/Authentication';
import MobileSideNavContextProvider from '../../components/MobileSideNav/MobileSideNavContextProvider';
import Header from '../../components/Header/Header';
import { OverlayLoading } from '../../components/OverlayLoading/OverlayLoading';
import SystemRootPage from './SystemRootPage';
import { loadingAction } from '../../reducer/loading';
import AuthService from '../../services/AuthService';

// const ManagementPage = React.lazy(() => import('../../Pages/System/Management/ManagementPageConf'));
// const ToolsPage = React.lazy(() => import('../../Pages/System/Tools/ToolsPageConf'));


function getRoutePermissions(authUser: User | undefined) {

    const routePermissions: IRoutePermission[] = [];
    //if (!authUser) return routePermissions;

    routePermissions.push({ route: 'management', component: SystemRootPage });
    routePermissions.push({ route: 'tools', component: SystemRootPage });

    return routePermissions;
}

function SystemRoot() {

    const { authUser } = useAuthentication();
    const match = useRouteMatch();

    const routePermissions = getRoutePermissions(authUser);

    return (
        <MobileSideNavContextProvider>
            <Header routePermissions={routePermissions} />
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <Suspense fallback={<OverlayLoading loading />}>
                    <Switch>
                        <Route exact path={match.url} component={SystemRootPage} />
                        {routePermissions.map((r, k) => <Route key={`route-${k}`} path={match.url + "/" + r.route} component={r.component} />)}
                        <Route render={() => <Redirect to={match?.url || ""} />} />
                    </Switch>
                </Suspense>
            </div>
        </MobileSideNavContextProvider>
    )
}

function AuthenticatedSystem({ children }: PropsWithChildren<{}>) {

    var timer: number = 0;

    const dispatch = useDispatch();
    const history = useHistory();

    const { loggedIn, authUser } = useAuthentication();

    useEffect(() => {
        if (authUser?.id) {
            startTimer();
            validateToken();
        }
        return stopTimer;
    }, []);

    useEffect(() => {
        if (loggedIn == false || !authUser) {
            history.push("/");
        }
    }, [authUser, loggedIn]);

    async function logOut() {
        dispatch(loadingAction(true));
        await AuthService.instance.logout();
        dispatch(loadingAction(false));
        dispatch(logoutAction());
    }

    async function validateToken() {
        var user = await AuthService.instance.getAuthUser();
        if (user === null) {
            await logOut();
        }
    }

    function startTimer() {
        timer = window.setInterval(validateToken, 60 * 1000); //1 minute
    }

    function stopTimer() {
        window.clearInterval(timer);
    }

    if (loggedIn && authUser) return <>{children}</>;

    return null;
}

function System() {

    const { authUser } = useAuthentication();

    return (
        <React.Fragment key={authUser?.id}>
            <BreadcrumbsProvider>
                <SystemRoot />
            </BreadcrumbsProvider>
        </React.Fragment >
    );

}

export default System;