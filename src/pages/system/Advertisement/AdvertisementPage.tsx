import { Route, RouteChildrenProps, Switch } from "react-router-dom";
import User from "../../../model/User";
import React from "react";
import { connect } from "react-redux";
import AdvertisementListPage from "./AdvertisementListPage";


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
                <Switch>
                    <Route path={match.url + "/"} exact component={AdvertisementListPage} />
                </Switch>
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