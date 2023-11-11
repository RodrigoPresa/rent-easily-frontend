import { Redirect, Route, RouteChildrenProps, Switch } from "react-router-dom";
import User from "../../../model/User";
import React from "react";
import { connect } from "react-redux";
import AdvertisementListPage from "./AdvertisementListPage";
import AdvertisementEditRootPage from "./AdvertisementEditRootPage";
import AdvertisementViewPage from "./AdvertisementViewPage";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { Trans } from "../../../components/Translate";
import TreeViewItemAgent from "../../../components/TreeView/TreeViewItemAgent";
import BreadcrumbDynamic from "../../../components/BreadcrumbDynamic";

interface AdvertisementContextValue {
    reloadTree: () => Promise<any>,
    addBreadCrumb?: (path: string) => void
}

const AdvertisementContext = React.createContext<AdvertisementContextValue>({
    reloadTree: async () => { },
    addBreadCrumb: (path: string) => { }
});

interface AdvertisementPageProps extends RouteChildrenProps {
    loggedIn: boolean,
    authUser: User
}

interface AdvertisementPageState {

}

class AdvertisementPage extends React.Component<AdvertisementPageProps, AdvertisementPageState> {
    constructor(props: AdvertisementPageProps) {
        super(props);
    }

    render() {
        const { match } = this.props;

        if (match === null)
            return null;

        return (
            <>
                <AdvertisementContext.Provider value={{ reloadTree: async () => null }}>
                    <div style={{ flex: 1, display: 'column', overflow: 'hidden' }} >
                        <BreadcrumbDynamic />
                        <BreadcrumbsItem to={match.url}>
                            Anúncios
                        </BreadcrumbsItem>
                        <Switch>
                            <Route path={match.url + "/"} exact component={AdvertisementListPage} />
                            <Route path={match.url + "/view/:id"} exact component={AdvertisementViewPage} />
                            <Route exact path={match?.url + "/add"} component={AdvertisementPage} />
                            <Route exact path={match?.url + "/:id"} component={AdvertisementEditRootPage} />
                            <Route exact path={match?.url + "/:id/edit"} component={AdvertisementEditRootPage} />
                            <Route render={() => <Redirect to={match?.url || ""} />} />
                        </Switch>
                    </div>
                </AdvertisementContext.Provider>
            </>
        );
    }
}

function mapStateToProps(state: any) {
    const { loggedIn, authUser } = state.authentication;
    return {
        loggedIn,
        authUser
    };
}

export default connect(mapStateToProps, {})(AdvertisementPage);