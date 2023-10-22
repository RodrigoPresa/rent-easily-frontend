import React from "react";
import User from "../../../model/User";
import { RouteChildrenProps } from "react-router-dom";
import Advertisement from "../../../model/Advertisement";
import { ServiceApi } from "../../../services/ServiceApi";
import { useSnackbar } from 'notistack';
import TableList from "../../../components/TableList/TableList";
import { connect } from "react-redux";
import { RootState } from "../../../reducer";
import { WithTranslateProps, withTranslate } from "../../../components/Translate/withTranslate";
import { Trans } from "../../../components/Translate";


export interface AdvertisementListPageProps extends RouteChildrenProps, WithTranslateProps {
    authUser?: User;
    list: Advertisement[];
}

export interface AdvertisementListPageState {
    list: Advertisement[];
    page: number;
    count: number;
    rowsPerPage: number;
    searchText: string;
}

interface AdvertisementRow {
    id: number;
    imageUrl: string;
    title: string;
    address: string;
    description: string;
    price: number;
}

class AdvertisementListPage extends React.Component<AdvertisementListPageProps, AdvertisementListPageState> {

    private service: ServiceApi<Advertisement>;

    constructor(props: AdvertisementListPageProps) {
        super(props);
        this.state = {
            list: [],
            page: 0,
            count: 0,
            rowsPerPage: 25,
            searchText: ''
        }

        this.service = new ServiceApi<Advertisement>('advertisement');

        this.onPageChange = this.onPageChange.bind(this);
        this.onRowsPerPageChange = this.onRowsPerPageChange.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    async componentDidMount() {
        const { searchText, page, rowsPerPage } = this.state;
        await this.reload(searchText, page, rowsPerPage);
    }

    async reload(searchText: string, page: number, rowsPerPage: number) {
        const list = await this.getAdvertisements(searchText, page, rowsPerPage);
        this.setState({ list });
    }

    getAdvertisements(searchText: string, page: number, rowsPerPage: number): Promise<Advertisement[]> {
        return this.service.getList();
    }

    onRowClick(advertisement: AdvertisementRow) {
        const { match, history } = this.props;
        if (!match || !advertisement) return;
        history.push(`${match.url}/${advertisement.id}`);
    }

    getAdvertisementRow(advertisement: Advertisement): AdvertisementRow {
        return {
            id: advertisement.id,
            imageUrl: "", // imagem do imóvel
            title: "", // talvez adicionar um campo de título no anúncio
            address: "", // adicionar um campo de endereço no anúncio
            description: advertisement.information,
            price: advertisement.rentAmount
        }
    }

    async onPageChange(page: number) {
        const { searchText, rowsPerPage } = this.state;
        this.setState({ searchText, page, rowsPerPage });
        await this.reload(searchText, page, rowsPerPage);
    }

    async onRowsPerPageChange(rowsPerPage: number) {
        const { searchText } = this.state;
        this.setState({ searchText, page: 0, rowsPerPage });
        await this.reload(searchText, 0, rowsPerPage);
    }

    async onSearchChange(searchTextNew: string) {
        const { rowsPerPage, page, searchText } = this.state;
        if (searchText === searchTextNew) return;
        this.setState({ searchText: searchTextNew, page: 0, rowsPerPage });
        await this.reload(searchTextNew, 0, rowsPerPage);
    }

    render() {
        const { list, page, count, rowsPerPage, searchText } = this.state;
        const { authUser } = this.props;

        // const editAllowed = permission?.includes(`${ApiScopes.Operador}.${ApiScopes.Update}`);
        // const addAllowed = permission?.includes(`${ApiScopes.Operador}.${ApiScopes.Create}`);
        // const deleteAllowed = permission?.includes(`${ApiScopes.Operador}.${ApiScopes.Delete}`);

        return (
            <>
                {/* <TableList<AdvertisementRow>
                    title="Anúncios"
                    columns={[
                        { field: 'id', visible: false, width: 30 },
                        { field: 'imageUrl', value: "" },
                        { field: 'title', value: "Tito"},
                        { field: 'address', value: "Endereço"},
                        { field: 'description', value: "Descrição"},
                        { field: 'price', value: "Preço"},
                    ]}
                    rows={list.map(a => this.getAdvertisementRow(a))}
                    selectableRow={true}
                    onRowClick={(a) => this.onRowClick(a)}
                    onRefreshClick={() => this.reload(searchText, page, rowsPerPage)}
                    onPageChange={(a) => { this.onPageChange(a) }}
                    onRowsPerPageChange={(a) => { this.onRowsPerPageChange(a) }}
                    onSearch={(a) => { this.onSearchChange(a) }}
                    page={page}
                    totalCount={count}
                    rowsPerPage={rowsPerPage}
                /> */}

                <div>anúncio</div>
            </>
        );
    }
}

export default connect((root: RootState) => ({ authUser: root.authentication.authUser }))(withTranslate<AdvertisementListPageProps>()(AdvertisementListPage));