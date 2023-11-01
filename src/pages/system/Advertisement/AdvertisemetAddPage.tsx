import { RouteChildrenProps } from "react-router-dom";
import { WithTranslateProps, withTranslate } from "../../../components/Translate/withTranslate";
import React from "react";
import { Trans } from "../../../components/Translate";
import Advertisement from "../../../model/Advertisement";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Panel from "../../../components/Panel";
import PanelBodyFormContent from "../../../components/Panel/PanelBodyFormContent";
import { AppBar, Tab, Tabs } from "@mui/material";
import { WithSnackbarProps, withSnackbar } from "notistack";
import { delay } from "../../../utils/util";
import AdvertisementForm, { AdvertisementFormData } from "./AdvertisementForm";
import { ServiceApi } from "../../../services/ServiceApi";


export interface AdvertisementAddPageProps extends RouteChildrenProps, WithSnackbarProps, WithTranslateProps {

}

export interface AdvertisementAddPageState {
    tabSelected: number;
    editingTab: number | undefined;
    generalComponentKey: number;
}

class AdvertisementAddPage extends React.Component<AdvertisementAddPageProps, AdvertisementAddPageState> {

    private service: ServiceApi<Advertisement>;

    constructor(props: AdvertisementAddPageProps) {
        super(props);
        this.state = {
            tabSelected: 0,
            editingTab: undefined,
            generalComponentKey: 0
        };

        this.service = new ServiceApi<Advertisement>('advertisement');

        this.onCancel = this.onCancel.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.alteringTab = this.alteringTab.bind(this);
        this.goToAdvertisementEditLink = this.goToAdvertisementEditLink.bind(this);
    }

    async onFormSubmit(data: AdvertisementFormData) {
        const { history, match, enqueueSnackbar, t } = this.props;
        const { active, information, propertyId, rentAmount } = data;

        const result = await this.service.insert(
            { active, information, propertyId, rentAmount }
        );

        if (result && match) {
            enqueueSnackbar(<Trans
                translateKey="elementSavedSuccessfully"
                capitalize
                valuesToReplace={{ element: t('controller', { capitalize: true }) }} />, { variant: 'success' }
            );
            await delay(100);
            var matchUrl = match?.url.replace('/add', `/${result.id}/edit`);
            history.push(matchUrl);
        } else {
            enqueueSnackbar(<Trans
                translateKey="elementSavedError"
                capitalize
                valuesToReplace={{ element: t('controller', { capitalize: true }) }} />, { variant: 'error' }
            );
        }
    }

    handleChangeTab(obj: any, tabSelected: number) {
        this.setState({ tabSelected });
    }

    alteringTab(tab: number) {
        this.setState({
            editingTab: tab
        });
    }

    onCancel() {
        const { history } = this.props;
        history.goBack();
    }

    goToAdvertisementEditLink(advertisement: Advertisement) {
        const { history } = this.props;

        var url = `/system/advertisement/${advertisement.id}/edit`;

        history.push(url);
    }

    async componentDidMount() {

    }

    render() {

        const { match, t } = this.props;
        const { tabSelected, editingTab, generalComponentKey } = this.state;

        if (!match) return null;

        return (
            <>
                <BreadcrumbsItem to={match.url}>
                    <Trans translateKey="addTitle" valuesToReplace={{ element: t('controller', { capitalize: true, namespace: "device" }) }} capitalize />
                </BreadcrumbsItem>
                <Panel panelHeaderTitle={<Trans translateKey="addTitle" valuesToReplace={{ element: t('controller', { capitalize: true, namespace: "device" }) }} capitalize />}>
                    <PanelBodyFormContent>
                        <AppBar position="relative" color="default">
                            <Tabs
                                value={tabSelected}
                                onChange={this.handleChangeTab}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                <Tab label={<Trans translateKey="general" capitalize />} />
                            </Tabs>
                        </AppBar>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                            {tabSelected === 0 && <AdvertisementForm
                                advertisement={null}
                                editing={(editingTab === 0)}
                                isDisabled={false}
                                alteringTab={this.alteringTab}
                                undoChanges={undefined}
                                key={'tab_general_' + generalComponentKey}
                                onSubmit={data => this.onFormSubmit(data)}
                                onCancel={this.onCancel}
                                goToAdvertisementEditLink={this.goToAdvertisementEditLink}
                            />
                            }
                        </div>
                    </PanelBodyFormContent>
                </Panel>
            </>
        );
    }
}

export default withSnackbar(withTranslate<AdvertisementAddPageProps>()(AdvertisementAddPage));