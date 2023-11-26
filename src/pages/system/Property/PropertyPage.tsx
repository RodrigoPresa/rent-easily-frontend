import { Redirect, Route, RouteChildrenProps, Switch } from "react-router-dom";
import User from "../../../model/User";
import React from "react";
import { connect } from "react-redux";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import BreadcrumbDynamic from "../../../components/BreadcrumbDynamic";
import PropertyListPage from "./PropertyListPage";
import PropertyViewPage from "./PropertyViewPage";

interface PropertyContextValue {
    reloadTree: () => Promise<any>,
    addBreadCrumb?: (path: string) => void
}

const PropertyContext = React.createContext<PropertyContextValue>({
    reloadTree: async () => { },
    addBreadCrumb: (path: string) => { }
});

interface PropertyPageProps extends RouteChildrenProps {
    loggedIn: boolean,
    authUser: User
}

interface PropertyPageState {

}

class PropertyPage extends React.Component<PropertyPageProps, PropertyPageState> {
    constructor(props: PropertyPageProps) {
        super(props);
    }

    render() {
        const { match } = this.props;

        if (match === null)
            return null;

        return (
            <>
                <PropertyContext.Provider value={{ reloadTree: async () => null }}>
                    <div style={{ flex: 1, display: 'column', overflow: 'auto' }} >
                        <BreadcrumbDynamic />
                        <BreadcrumbsItem to={match.url}>
                            Imóveis
                        </BreadcrumbsItem>
                        <Switch>
                            <Route path={match.url + "/"} exact component={PropertyListPage} />
                            <Route path={match.url + "/view/:id"} exact component={PropertyViewPage} />
                            <Route render={() => <Redirect to={match?.url || ""} />} />
                        </Switch>
                    </div>
                </PropertyContext.Provider>
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

export default connect(mapStateToProps, {})(PropertyPage);