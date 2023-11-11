import { RouteChildrenProps } from "react-router-dom";
import { WithTranslateProps, withTranslate } from "../../../components/Translate/withTranslate";
import User from "../../../model/User";
import Advertisement from "../../../model/Advertisement";
import React from "react";
import { Trans } from "../../../components/Translate";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Panel from "../../../components/Panel";
import PanelBodyFormContent from "../../../components/Panel/PanelBodyFormContent";
import { AppBar, Tab, Tabs } from "@mui/material";
import { connect } from "react-redux";
import { RootState } from "../../../reducer";
import { WithSnackbarProps, withSnackbar } from "notistack";
import { ServiceApi } from "../../../services/ServiceApi";
import AdvertisementForm, { AdvertisementFormData } from "./AdvertisementForm";


export interface AdvertisementEditPageParams {
    id: string;
}

export interface AdvertisementEditPageProps extends RouteChildrenProps<AdvertisementEditPageParams>, WithSnackbarProps, WithTranslateProps {
    authUser?: User;
}

export interface AdvertisementEditPageState {
    advertisement: Advertisement | null;
    tabSelected: number;
    disableTabGeneral: boolean;
    editingTab: number | undefined;
    editing: boolean;
    generalComponentKey: number;
}

export interface AdvertisementFormContextData {
    reload: () => any;
    advertisement: Advertisement | null;
}

export const AdvertisementFormContext = React.createContext<AdvertisementFormContextData>({
    reload: () => { },
    advertisement: null
});

class AdvertisementEditPage extends React.Component<AdvertisementEditPageProps, AdvertisementEditPageState> {

    private service: ServiceApi<Advertisement>;

    constructor(props: AdvertisementEditPageProps) {
        super(props);
        this.state = {
            advertisement: null,
            tabSelected: 0,
            disableTabGeneral: false,
            editingTab: undefined,
            editing: false,
            generalComponentKey: 0
        }

        this.service = new ServiceApi<Advertisement>('advertisement');

        this.onCancel = this.onCancel.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.undoChanges = this.undoChanges.bind(this);
        this.alteringTab = this.alteringTab.bind(this);
        this.goToAdvertisementEditLink = this.goToAdvertisementEditLink.bind(this);
        this.handleEditingChange = this.handleEditingChange.bind(this);
    }

    async componentDidMount() {
        await this.reload();
    }

    async reload() {

    }

    async getAdvertisement(): Promise<Advertisement | null> {
        const { match } = this.props;
        if (!match) return null;
        const id = match.params.id;
        return await this.service.getById(id);
    }

    async onFormSubmit(data: AdvertisementFormData, isDirty: boolean) {
        const { match, history, enqueueSnackbar, t } = this.props;
        const { generalComponentKey, advertisement } = this.state;
        if (!match) return;

        const id = match.params.id;
        const { active, information, property: propertyId, rentAmount } = data;

        const result = isDirty ? await this.service.update(id, {
            active, information, propertyId, rentAmount
        }) : true;

        if (result) {
            const advertisement = await this.getAdvertisement();

            this.setState({
                advertisement,
                editingTab: undefined,
                disableTabGeneral: false,
                generalComponentKey: generalComponentKey + 1
            });

            enqueueSnackbar(<Trans
                translateKey="elementSavedSuccessfully"
                capitalize
                valuesToReplace={{ element: t('advertisement', { capitalize: true }) }} />, { variant: 'success' }
            );
        } else {
            enqueueSnackbar(<Trans
                translateKey="elementSavedError"
                capitalize
                valuesToReplace={{ element: t('advertisement', { capitalize: true }) }} />, { variant: 'error' }
            );
        }
    }

    async undoChanges(tab: number) {
        const { generalComponentKey } = this.state;
        this.setState({
            editingTab: undefined,
            disableTabGeneral: false,
            generalComponentKey: (tab === 0 ? generalComponentKey + 1 : generalComponentKey),
            editing: false
        });
    }

    handleEditingChange = (changed: boolean) => {
        this.setState({ editing: changed })
    }

    handleChangeTab(obj: any, tabSelected: number) {
        this.setState({ tabSelected });
    }

    alteringTab(tab: number) {
        const disableTabGeneral = tab === 0 ? false : true;

        this.setState({
            disableTabGeneral,
            editingTab: tab
        });
    }

    onCancel() {
        const { history } = this.props;
        history.push(`/system/advertisement`);
    }

    goToAdvertisementEditLink(advertisement: Advertisement) {
        const { history } = this.props;
        var url = `/system/advertisement/${advertisement.id}/edit`;
        history.push(url);
    }

    render() {
        const { match, t, authUser } = this.props;
        const { advertisement, tabSelected, editingTab,
            generalComponentKey, disableTabGeneral } = this.state;

        if (!match) return null;
        if (advertisement === null) return null;
        if (!authUser) return null;

        return (
            <AdvertisementFormContext.Provider
                value={{ advertisement, reload: () => this.reload() }}
            >
                <BreadcrumbsItem to={match.url}>
                    <Trans translateKey="editTitle" valuesToReplace={{ element1: t('advertisement', { capitalize: true }), element2: '' }} capitalize />
                </BreadcrumbsItem>
                <Panel panelHeaderTitle={<Trans translateKey="editTitle" valuesToReplace={{ element1: t('advertisement', { capitalize: true }), element2: '' }} capitalize />}>
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
                                <Tab key={0}
                                    disabled={disableTabGeneral}
                                    title={disableTabGeneral ? t('saveOrUndoBeforeSwitchingTabs', { capitalize: true }) : ''}
                                    label={<Trans translateKey="general" capitalize />}
                                />
                            </Tabs>
                        </AppBar>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                            {tabSelected === 0 && <AdvertisementForm
                                authUser={authUser}
                                advertisement={advertisement}
                                editing={(editingTab === 0)}
                                isDisabled={false}
                                alteringTab={this.alteringTab}
                                undoChanges={() => this.undoChanges(0)}
                                key={'tab_general_' + generalComponentKey}
                                onSubmit={(data, isDirty) => this.onFormSubmit(data, isDirty)}
                                onCancel={this.onCancel}
                                onChange={this.handleEditingChange}
                                goToAdvertisementEditLink={this.goToAdvertisementEditLink}
                            />
                            }
                        </div>
                    </PanelBodyFormContent>
                </Panel>
            </AdvertisementFormContext.Provider>
        );
    }
}

export default connect((root: RootState) => ({ authUser: root.authentication.authUser }))(withSnackbar(withTranslate<AdvertisementEditPageProps>()(AdvertisementEditPage)));