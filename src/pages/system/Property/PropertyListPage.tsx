import React from "react";
import User from "../../../model/User";
import { RouteChildrenProps } from "react-router-dom";
import { ServiceApi } from "../../../services/ServiceApi";
import { connect } from "react-redux";
import { RootState } from "../../../reducer";
import { WithTranslateProps, withTranslate } from "../../../components/Translate/withTranslate";
import { Dialog, Grid, Typography } from "@mui/material";
import Property from "../../../model/Property";
import PropertyView from "./PropertyView";
import DefaultButton from "../../../components/DefaultButton";
import { StatesArray } from "../../../utils/StatesArray";
import PropertyForm, { PropertyFormData } from "./PropertyForm";
import PropertyAddress from "../../../model/PropertyAddress";
import { WithSnackbarProps, withSnackbar } from "notistack";

const states = StatesArray(true);

export interface PropertyListPageProps extends RouteChildrenProps, WithSnackbarProps, WithTranslateProps {
    authUser?: User;
}

export interface PropertyListPageState {
    description: string;
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    streetNumber: number;
    zipCode: string;
    propertyList: Property[];
    isCreateModalOpen: boolean;
    page: number;
    count: number;
    rowsPerPage: number;
    searchText: string;
}

class PropertyListPage extends React.Component<PropertyListPageProps, PropertyListPageState> {

    private propertyService: ServiceApi<Property>;

    constructor(props: PropertyListPageProps) {
        super(props);
        this.state = {
            description: '',
            country: '',
            state: '',
            city: '',
            neighborhood: '',
            street: '',
            streetNumber: 0,
            zipCode: '',
            propertyList: [],
            isCreateModalOpen: false,
            page: 0,
            count: 0,
            rowsPerPage: 25,
            searchText: ''
        }

        this.propertyService = new ServiceApi<Property>('property');

        this.handleOpenCreateModal = this.handleOpenCreateModal.bind(this);
        this.handleCloseCreateModal = this.handleCloseCreateModal.bind(this);
        this.handleSaveChanges = this.handleSaveChanges.bind(this);
    }

    async componentDidMount() {
        await this.reload();
    }

    async reload() {
        const propertyList = await this.getProperties();
        this.setState({ propertyList });
    }

    async getProperties(): Promise<Property[]> {
        const { authUser } = this.props;

        const list = await this.propertyService.getList();
        return (list.data.filter(p => p.userId === authUser?.id));
    }

    handleOpenCreateModal = () => {
        this.setState({ isCreateModalOpen: true });
    };

    handleCloseCreateModal = () => {
        this.setState({ isCreateModalOpen: false });
    };

    handleSaveChanges = async (data: PropertyFormData) => {
        const { authUser, match, enqueueSnackbar } = this.props;
        const { propertyList } = this.state;

        if (!authUser) return;
        if (!match) return;

        const registryId = (propertyList.length + Math.floor(Math.random() * 1000) + 1).toString();

        const { city, country, description, neighborhood, state, street, streetNumber, zipCode } = data;

        const address: PropertyAddress = {
            city,
            country: 'Brasil',
            neighborhood,
            state,
            street,
            streetNumber,
            zipCode,
        };

        const result = await this.propertyService.insert(
            { description, userId: authUser.id, registryId, address }
        );
        if (result) {
            const propertyList = await this.getProperties();

            this.setState({
                propertyList
            });

            enqueueSnackbar('Cadastro enviado para verificação.', { variant: 'success' });
        } else {
            enqueueSnackbar('Erro ao realizar o cadastro do imóvel', { variant: 'error' });
        }

        this.setState({ isCreateModalOpen: false });
    };

    render() {
        const { propertyList, isCreateModalOpen } = this.state;
        const { authUser } = this.props;

        return (
            <>
                <Grid container margin={5}>
                    <Grid item>
                        <DefaultButton variant="contained" onClick={this.handleOpenCreateModal}>Cadastrar imóvel</DefaultButton>
                    </Grid>
                </Grid>
                <Grid container>
                    {propertyList.length > 0 ? propertyList.map(p => (
                        <React.Fragment key={p.id}>
                            <Grid item xs={6} sm={6} md={4} lg={4}>
                                <PropertyView
                                    id={p.id}
                                    property={p}
                                />
                            </Grid>
                        </React.Fragment>
                    )) :
                        <Grid container direction="column" alignItems="center" marginTop={5}>
                            <Typography variant="subtitle2" fontSize="1.2rem">Nenhum imóvel disponível</Typography>
                        </Grid>
                    }
                </Grid>

                {/* Modal de Cadastro */}
                <Dialog open={isCreateModalOpen} onClose={this.handleCloseCreateModal}>
                    <PropertyForm
                        property={null}
                        onSubmit={this.handleSaveChanges}
                        onCancel={this.handleCloseCreateModal}
                        editing={false}
                        isDisabled={false}
                        undoChanges={undefined}
                    />
                </Dialog>
            </>
        );
    }
}

export default connect((root: RootState) => ({ authUser: root.authentication.authUser }))(withSnackbar(withTranslate<PropertyListPageProps>()(PropertyListPage)));