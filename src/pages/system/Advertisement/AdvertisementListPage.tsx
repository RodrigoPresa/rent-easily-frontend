import React from "react";
import User from "../../../model/User";
import { Link, RouteChildrenProps } from "react-router-dom";
import Advertisement from "../../../model/Advertisement";
import { ResponseData, ServiceApi } from "../../../services/ServiceApi";
import { useSnackbar } from 'notistack';
import TableList from "../../../components/TableList/TableList";
import { connect } from "react-redux";
import { RootState } from "../../../reducer";
import { WithTranslateProps, withTranslate } from "../../../components/Translate/withTranslate";
import { Trans } from "../../../components/Translate";
import AdvertisementView from "./AdvertisementView";
import Panel from "../../../components/Panel";
import PanelBodyContent from "../../../components/Panel/PanelBodyContent";
import { Grid } from "@mui/material";
import { hi } from "date-fns/locale";
import Property from "../../../model/Property";
import { get } from "http";
import PropertyAddress from "../../../model/PropertyAddress";

const ads = [
    {
        id: 1,
        imageUrl: "https://images.adsttc.com/media/images/5f90/e509/63c0/1779/0100/010e/newsletter/3.jpg?1603331288",
        title: "Imóvel 1",
        address: "Rua 1",
        rentAmount: 1000
    },
    {
        id: 2,
        imageUrl: "https://casacor.abril.com.br/wp-content/uploads/sites/7/2022/01/Casa-Liu-Raiz-Arquitetura-Foto-Leonardo-Giantomasi-2.jpg?quality=90&strip=info",
        title: "Imóvel 2",
        address: "Rua 2",
        rentAmount: 1200
    },
    {
        id: 3,
        imageUrl: "https://vgprojetos.com/wp-content/uploads/2022/09/P11-IMG-3.jpg",
        title: "Imóvel 3",
        address: "Rua 3",
        rentAmount: 1250
    },
    {
        id: 4,
        imageUrl: "https://casademadeira.com.br/wp-content/uploads/2023/08/casa-de-madeira-dallas-5.jpg",
        title: "Imóvel 4",
        address: "Rua 4",
        rentAmount: 950
    },
];


export interface AdvertisementListPageProps extends RouteChildrenProps, WithTranslateProps {
    authUser?: User;
}

export interface AdvertisementListPageState {
    list: Advertisement[];
    propertyList: Property[];
    favoriteStatus: { [key: number]: boolean };
    page: number;
    count: number;
    rowsPerPage: number;
    searchText: string;
}

class AdvertisementListPage extends React.Component<AdvertisementListPageProps, AdvertisementListPageState> {

    private service: ServiceApi<Advertisement>;
    private propertyService: ServiceApi<Property>;

    constructor(props: AdvertisementListPageProps) {
        super(props);
        this.state = {
            list: [],
            propertyList: [],
            favoriteStatus: {},
            page: 0,
            count: 0,
            rowsPerPage: 25,
            searchText: ''
        }

        this.service = new ServiceApi<Advertisement>('advertisement');
        this.propertyService = new ServiceApi<Property>('property');

        this.onFavoriteClickHandler = this.onFavoriteClickHandler.bind(this);
    }

    async componentDidMount() {
        const { searchText, page, rowsPerPage } = this.state;
        await this.reload(searchText, page, rowsPerPage);
    }

    async reload(searchText: string, page: number, rowsPerPage: number) {
        const list = await this.getAdvertisements(searchText, page, rowsPerPage);
        const propertyList = await this.getProperties(searchText, page, rowsPerPage);
        this.setState({ list, propertyList});
    }

    getAdvertisements(searchText: string, page: number, rowsPerPage: number): Promise<Advertisement[]> {
        return this.service.getList().then(list => (list.data));
    }
    
    getProperties(searchText: string, page: number, rowsPerPage: number): Promise<Property[]> {
        return this.propertyService.getList().then(list => (list.data));
    }

    getPropertyAddress(propertyId: number): PropertyAddress | undefined {
        const { propertyList } = this.state;
        const property = propertyList.find(p => p.id === propertyId);
        const address = property?.address;

        return address;
    }

    onFavoriteClickHandler(advertisementId: number) {
        const { authUser, history } = this.props;

        if (!authUser) history.push('/login');

        this.setState(prevState => {
            const favoriteStatus = { ...prevState.favoriteStatus };
            favoriteStatus[advertisementId] = !favoriteStatus[advertisementId];
            return { favoriteStatus };
        });
    }

    render() {
        const { list, propertyList, favoriteStatus, page, count, rowsPerPage, searchText } = this.state;
        const { authUser } = this.props;
        
        // const editAllowed = permission?.includes(`${ApiScopes.Operador}.${ApiScopes.Update}`);
        // const addAllowed = permission?.includes(`${ApiScopes.Operador}.${ApiScopes.Create}`);
        // const deleteAllowed = permission?.includes(`${ApiScopes.Operador}.${ApiScopes.Delete}`);

        return (
            <>
                <Panel
                    panelHeaderTitle=""
                >
                    <PanelBodyContent>
                        <Grid container direction="row" alignItems="center">
                            {list ? list.map(ad => (
                                <React.Fragment key={ad.id}>
                                    <Grid item xs={6} sm={6} md={4} lg={4} >
                                        <AdvertisementView
                                            id={ad.id}
                                            address={this.getPropertyAddress(ad.id)}
                                            imageUrl={ads[Math.floor(Math.random() * 4)].imageUrl}
                                            advertisement={ad}
                                            onFavoriteClick={() => this.onFavoriteClickHandler(ad.id)}
                                            isFavorite={favoriteStatus[ad.id] || false}
                                        />
                                    </Grid>
                                </React.Fragment>
                            )) :
                                <div style={{ textAlign: 'center' }}>Nenhum anúncio disponível</div>
                            }
                        </Grid>
                    </PanelBodyContent>
                </Panel >
            </>
        );
    }
}

export default connect((root: RootState) => ({ authUser: root.authentication.authUser }))(withTranslate<AdvertisementListPageProps>()(AdvertisementListPage));