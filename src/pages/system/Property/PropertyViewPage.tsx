import React, { useEffect, useState } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from "@mui/material";
import { PropertyViewProps } from "./PropertyView";
import { makeStyles } from "@mui/styles";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useAuthentication } from "../../../reducer/Authentication";
import { ServiceApi } from "../../../services/ServiceApi";
import Property from "../../../model/Property";
import Carousel from "../../../components/Carousel";
import DefaultButton from "../../../components/DefaultButton";
import Advertisement from "../../../model/Advertisement";
import AdvertisementDTO from "../../../model/AdvertisementDTO";
import { WithSnackbarProps, withSnackbar } from "notistack";
import Proposal from "../../../model/Proposal";

const images = [
  "https://s2.glbimg.com/CS6ziQq57qk1F18WhdJoRWDjT8s=/e.glbimg.com/og/ed/f/original/2021/08/09/materiais-naturais-valorizam-a-decoracao-dessa-casa-de-1000-m2-6.jpg",
  "https://images.adsttc.com/media/images/62b9/d437/3e4b/31fb/a700/0019/newsletter/casa-maca-28-workshop-diseno-y-construccion.jpg?1656345648",
  "https://img.freepik.com/fotos-gratis/3d-renderizacao-loft-sala-de-estar-escandinava-com-mesa-de-trabalho-e-estante_105762-2094.jpg",
  "https://images.tcdn.com.br/img/img_prod/631328/cozinha_modulada_atena_100_mdf_13_pecas_grafite_arte_cas_3031_1_ae7f0b168504b898c50ec5a05c0da33e.jpeg",
  "https://i.pinimg.com/736x/63/1c/25/631c25d99067c3ef095bf539651d1bfc.jpg"
];

const useStyles = makeStyles(() => ({
  carouselContainer: {
    backgroundColor: "rgba(220, 220, 220, 0.5)",
  }
}));

const PropertyViewPage: React.FC<WithSnackbarProps> = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const match = useRouteMatch();

  //const { property } = location.state as PropertyViewProps;
  const { authUser } = useAuthentication();

  const [property, setProperty] = useState<Property>();
  const [adList, setAdList] = useState<Advertisement[]>([]);
  const [proposalList, setProposalList] = useState<Proposal[]>();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isProposalModalOpen, setProposalModalOpen] = useState(false);
  const [adInformation, setAdInformation] = useState("");
  const [adRentAmount, setAdRentAmount] = useState(0);

  const proposalService = new ServiceApi<Proposal>('proposal');
  const advertisementService = new ServiceApi<Advertisement>('advertisement');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await proposalService.getList();
        
        const filteredList = list.data.filter((proposal) => proposal.advertisementId === adList.find(ad => ad.propertyId === property?.id)?.id);
        setProposalList(filteredList);
      } catch (error) {
        console.error("Error fetching proposal:", error);
      }
    };

    fetchData();
  }, [adList]);

  useEffect(() => {
    if (location.state) {
      const { property } = location.state as PropertyViewProps;
      setProperty(property);
    }
    getAdvertisement();
  }, []);

  const getAdvertisement = async (): Promise<Advertisement[]> => {
    const list = await advertisementService.getList();
    setAdList(list.data);
    return (list.data);
  }

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleOpenProposalModal = () => {
    setProposalModalOpen(true);
  };

  const handleCloseProposalModal = () => {
    setProposalModalOpen(false);
  };

  const handleSaveChanges = async () => {
    const { enqueueSnackbar } = props;
    if (!property) return;
    const data: AdvertisementDTO = {
      rentAmount: adRentAmount,
      information: adInformation,
      propertyId: property.id
    };

    const result = await advertisementService.insert(data);
    if (result) {
      getAdvertisement();

      enqueueSnackbar('Anúncio criado com sucesso.', { variant: 'success' });
    } else {
      enqueueSnackbar('Erro ao realizar o cadastro do anúncio', { variant: 'error' });
    }

    setCreateModalOpen(false);
  };


  return (
    <>
      <BreadcrumbsItem to={match.url}>
        {property?.address?.street}
      </BreadcrumbsItem>
      <Grid className={classes.carouselContainer} container direction="column" alignItems="center" marginBottom={5}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Carousel images={images} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12} sm={6} padding={5}>
          <Typography variant="h4">{property?.address?.street}</Typography>
          <Typography variant="subtitle1">{`${property?.address?.neighborhood}, ${property?.address?.city}/${property?.address?.state}`}</Typography>
          <Typography variant="body1">{property?.description}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} padding={5}>
          <Grid item marginBottom={5}>
            {
              property?.active ?
                <Typography variant="h5">
                  Registro: <span style={{ color: 'blue', fontWeight: 'bold' }}>{property.registryId}</span>
                </Typography> :
                <Typography variant="h5">
                  Status: <span style={{ color: 'blue', fontWeight: 'bold' }}>Imóvel aguardando liberação</span>
                </Typography>
            }
          </Grid>
          <Grid item marginBottom={5}>
            {
              property?.active && !adList.some(ad => ad.propertyId === property.id) ?
                <DefaultButton variant="contained" onClick={handleOpenCreateModal}>Criar anúncio</DefaultButton> :
                null
            }
          </Grid>
          <Grid item marginBottom={5}>
            {
              property?.active && adList.some(ad => ad.propertyId === property.id) ?
                <DefaultButton variant="contained" onClick={handleOpenProposalModal}>Ver propostas ({proposalList?.length})</DefaultButton> : null
            }
          </Grid>
        </Grid>
      </Grid>

      {/* Modal de Cadastro */}
      <Dialog open={isCreateModalOpen} onClose={handleCloseCreateModal}>
        <DialogTitle>Cadastrar Anúncio</DialogTitle>
        <DialogContent>
          <TextField
            label="Informação"
            fullWidth
            value={adInformation}
            onChange={(e) => setAdInformation(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Valor do Aluguel"
            fullWidth
            type="number"
            value={adRentAmount}
            onChange={(e) => setAdRentAmount(parseInt(e.target.value))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal}>Cancelar</Button>
          <Button onClick={handleSaveChanges}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Propostas */}
      <Dialog fullWidth open={isProposalModalOpen} onClose={handleCloseProposalModal}>
        <DialogTitle>Propostas</DialogTitle>
        <DialogContent>
          {proposalList?.map((proposal) => (
            <>
              <Grid item xs={12} sm={12} md={12} lg={12} marginBottom={2}>
                <Typography variant="subtitle1">{proposal.dateTime?.toString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography variant="h5">Informações</Typography>
                <Typography variant="body1">{proposal.information}</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography variant="h5">Valor proposto</Typography>
                <Typography variant="body1">R${proposal.amount}</Typography>
              </Grid>
              <Divider />
            </>
          )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProposalModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withSnackbar(PropertyViewPage);
