import React, { PropsWithChildren, Suspense, useEffect } from 'react';
import { BreadcrumbsItem, BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import User from '../../model/User';
import { IRoutePermission } from './IRoutePermissions';
import { logoutAction, useAuthentication } from '../../reducer/Authentication';
import MobileSideNavContextProvider from '../../components/MobileSideNav/MobileSideNavContextProvider';
import Header from '../../components/Header/Header';
import { OverlayLoading } from '../../components/OverlayLoading/OverlayLoading';
import SystemRootPage from './SystemRootPage';
import TreeViewSelectProvider from '../../components/TreeView/TreeViewSelectProvider';
import AuthService from '../../services/AuthService';
import { useDispatch } from 'react-redux';
import { loadingAction } from '../../reducer/loading';

const AdvertisementPage = React.lazy(() => import('./Advertisement/AdvertisementPage'));
const PropertyPage = React.lazy(() => import('./Property/PropertyPage'));


function getRoutePermissions(authUser: User | undefined) {
    const routePermissions: IRoutePermission[] = [];

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