import React from "react";
import User from "../../../model/User";
import { RouteChildrenProps } from "react-router-dom";
import Advertisement from "../../../model/Advertisement";
import { ServiceApi } from "../../../services/ServiceApi";
import { connect } from "react-redux";
import { RootState } from "../../../reducer";
import { WithTranslateProps, withTranslate } from "../../../components/Translate/withTranslate";
import AdvertisementView from "./AdvertisementView";
import { Grid, Typography } from "@mui/material";
import Property from "../../../model/Property";
import PropertyAddress from "../../../model/PropertyAddress";
import Favorite from "../../../model/Favorite";
import DateTimeDTO from "../../../model/DateTimeDTO";
import moment from "moment";

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

interface FavoriteRequest {
    userId: number;
    advertisementId: number;
    dateTime: DateTimeDTO;
}

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
    private favoriteService: ServiceApi<Favorite>;

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
        this.favoriteService = new ServiceApi<Favorite>('favorite');

        this.onFavoriteClickHandler = this.onFavoriteClickHandler.bind(this);
    }

    async componentDidMount() {
        const { searchText, page, rowsPerPage } = this.state;
        await this.reload(searchText, page, rowsPerPage);
    }

    async reload(searchText: string, page: number, rowsPerPage: number) {
        const list = await this.getAdvertisements(searchText, page, rowsPerPage);
        const propertyList = await this.getProperties(searchText, page, rowsPerPage);
        this.setState({ list, propertyList });
    }

    getAdvertisements(searchText: string, page: number, rowsPerPage: number): Promise<Advertisement[]> {
        return this.service.getList(undefined, false).then(list => (list.data));
    }

    getProperties(searchText: string, page: number, rowsPerPage: number): Promise<Property[]> {
        return this.propertyService.getList().then(list => (list.data));
    }

    getPropertyAddress(propertyId: number): PropertyAddress | undefined {
        const { propertyList } = this.state;
        const property = propertyList.find(p => p.id === propertyId);
        if (!property) return undefined;
        const address = property.address;

        return address;
    }

    setFavoriteStatus(advertisementId: number, userId: number, status: boolean) {
        if (status) {
            const dateTime = new Date();
            const data: FavoriteRequest = {
                advertisementId,
                userId,
                dateTime: {
                    date: moment(dateTime).format('YYYY-MM-DD'),
                    time: moment(dateTime).format('HH:mm:ss')
                }
            }
            this.favoriteService.insert(data);
        } else {
            this.favoriteService.delete(advertisementId);
        }
    }

    onFavoriteClickHandler(advertisement: Advertisement) {
        const { authUser, history } = this.props;

        if (!authUser) {
            history.push('/login');
            return;
        };

        if (authUser?.id === advertisement.propertyId) return;

        //this.setFavoriteStatus(advertisement.id, authUser.id, !this.state.favoriteStatus[advertisement.id]);
        this.setState(prevState => {
            const favoriteStatus = { ...prevState.favoriteStatus };
            favoriteStatus[advertisement.id] = !favoriteStatus[advertisement.id];
            return { favoriteStatus };
        });
    }

    render() {
        const { list, propertyList, favoriteStatus, page, count, rowsPerPage, searchText } = this.state;
        const { authUser } = this.props;

        return (
            <>
                <Grid container direction="row" alignItems="center">
                    {list ? list.map(ad => (
                        <React.Fragment key={ad.id}>
                            <Grid item xs={6} sm={6} md={4} lg={4} >
                                <AdvertisementView
                                    id={ad.id}
                                    address={this.getPropertyAddress(ad.propertyId)}
                                    imageUrl={ads[Math.floor(Math.random() * 4)].imageUrl}
                                    advertisement={ad}
                                    onFavoriteClick={() => this.onFavoriteClickHandler(ad)}
                                    isFavorite={favoriteStatus[ad.id] || false}
                                />
                            </Grid>
                        </React.Fragment>
                    )) :
                        <Grid container direction="column" alignItems="center" marginTop={5}>
                            <Typography variant="subtitle2" fontSize="1.2rem">Nenhum anúncio disponível</Typography>
                        </Grid>
                    }
                </Grid>
            </>
        );
    }
}

export default connect((root: RootState) => ({ authUser: root.authentication.authUser }))(withTranslate<AdvertisementListPageProps>()(AdvertisementListPage));