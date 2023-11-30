import React, { Suspense } from 'react';
import { BreadcrumbsItem, BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import User from '../../model/User';
import { IRoutePermission } from './IRoutePermissions';
import { useAuthentication } from '../../reducer/Authentication';
import MobileSideNavContextProvider from '../../components/MobileSideNav/MobileSideNavContextProvider';
import Header from '../../components/Header/Header';
import { OverlayLoading } from '../../components/OverlayLoading/OverlayLoading';
import SystemRootPage from './SystemRootPage';
import TreeViewSelectProvider from '../../components/TreeView/TreeViewSelectProvider';

const AdvertisementPage = React.lazy(() => import('./Advertisement/AdvertisementPage'));
const PropertyPage = React.lazy(() => import('./Property/PropertyPage'));


function getRoutePermissions(authUser: User | undefined) {
    const routePermissions: IRoutePermission[] = [];
    //if (!authUser) return routePermissions;

    routePermissions.push({ route: 'advertisement', component: AdvertisementPage });
    routePermissions.push({ route: 'properties', component: PropertyPage });

    return routePermissions;
}

function SystemRoot() {

    const { authUser } = useAuthentication();
    const match = useRouteMatch();

    const routePermissions = getRoutePermissions(authUser);

    return (
        <MobileSideNavContextProvider>
            <Header routePermissions={routePermissions} />
            <div style={{ flex: 1, display: 'flex', overflow: 'auto' }}>
                <Suspense fallback={<OverlayLoading loading />}>
                    <BreadcrumbsItem to={`/system`}>
                        Home
                    </BreadcrumbsItem>
                    <Switch>
                        <Route exact path={match.url} component={SystemRootPage} />
                        {routePermissions.map((r, k) => (
                            <Route key={`route-${k}`} path={match.url + "/" + r.route} component={r.component} />)
                        )}
                        <Route render={() => <Redirect to={match?.url || ""} />} />
                    </Switch>
                </Suspense>
            </div>
        </MobileSideNavContextProvider>
    )
}

// function AuthenticatedSystem({ children }: PropsWithChildren<{}>) {

//     var timer: number = 0;

//     const dispatch = useDispatch();
//     const history = useHistory();

//     const { loggedIn, authUser } = useAuthentication();

//     useEffect(() => {
//         if (authUser?.id) {
//             startTimer();
//             validateToken();
//         }
//         return stopTimer;
//     }, []);

//     useEffect(() => {
//         if (loggedIn == false || !authUser) {
//             history.push("/");
//         }
//     }, [authUser, loggedIn]);

//     async function logOut() {
//         dispatch(loadingAction(true));
//         await AuthService.instance.logout();
//         dispatch(loadingAction(false));
//         dispatch(logoutAction());
//     }

//     async function validateToken() {
//         var user = await AuthService.instance.getAuthUser();
//         if (user === null) {
//             await logOut();
//         }
//     }

//     function startTimer() {
//         timer = window.setInterval(validateToken, 60 * 1000); //1 minute
//     }

//     function stopTimer() {
//         window.clearInterval(timer);
//     }

//     if (loggedIn && authUser) return <>{children}</>;

//     return null;
// }

function System() {

    const { authUser } = useAuthentication();

    return (
        <React.Fragment key={authUser?.id}>
            <TreeViewSelectProvider>
                <BreadcrumbsProvider>
                    <SystemRoot />
                </BreadcrumbsProvider>
            </TreeViewSelectProvider>
        </React.Fragment >
    );

}

export default System;