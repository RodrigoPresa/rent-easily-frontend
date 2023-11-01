import React from 'react';
import { Redirect, Route, RouteChildrenProps, Switch } from "react-router-dom";
import AdvertisementEditPage from './AdvertisementEditPage';

interface EditPageParams {
	id: string;
}

export default class AdvertisementEditRootPage extends React.Component<RouteChildrenProps<EditPageParams>>{

	render() {
		const { match, history, location } = this.props;
		if (!match) return null;

		var id = match.params.id;
		if (!id) return null;

		return <AdvertisementEditPage key={id} {...{ match, history, location }} />
	}

}