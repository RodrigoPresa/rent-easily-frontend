import React, { useEffect, useState } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { AdvertisementViewProps } from "./AdvertisementView";
import Carousel from "../../../components/Carousel";
import { makeStyles } from "@mui/styles";
import DefaultButton from "../../../components/DefaultButton";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useAuthentication } from "../../../reducer/Authentication";
import { ServiceApi } from "../../../services/ServiceApi";
import Property from "../../../model/Property";
import Proposal from "../../../model/Proposal";
import { WithSnackbarProps, withSnackbar } from "notistack";
import ProposalDTO from "../../../model/ProposalDTO";

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

const AdvertisementViewPage: React.FC<WithSnackbarProps> = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const match = useRouteMatch();

  const { imageUrl, address, advertisement, onFavoriteClick, isFavorite } = location.state as AdvertisementViewProps;
  const { authUser } = useAuthentication();

  const [property, setProperty] = useState<Property>();
  const [proposalList, setProposalList] = useState<Proposal[]>();
  const [isProposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalInformation, setProposalInformation] = useState("");
  const [proposalRentAmount, setProposalRentAmount] = useState(0);

  const service = new ServiceApi<Property>('property');
  const proposalService = new ServiceApi<Proposal>('proposal');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await proposalService.getList();
        const filteredList = list.data.filter((proposal) => proposal.advertisementId === advertisement.id && proposal.userId === authUser?.id); 
        setProposalList(filteredList);
      } catch (error) {
        console.error("Error fetching proposal:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const property = await service.getById(advertisement.propertyId);
        setProperty(property.data[0]);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchData();
  }, [advertisement.propertyId]);

  const handleOpenProposalModal = () => {
    setProposalModalOpen(true);
  };

  const handleCloseProposalModal = () => {
    setProposalModalOpen(false);
  };

  const handleSaveChanges = async () => {
    const { enqueueSnackbar } = props;
    if (!authUser) return;
    const data: ProposalDTO = {
      advertisementId: advertisement.id,
      userId: authUser.id,
      information: proposalInformation,
      amount: proposalRentAmount,
      proposedAt: {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toISOString().split('T')[1].replace('Z', '')
      } 
    };

    const result = await proposalService.insert(data);
    if (result) {
      enqueueSnackbar('Proposta enviada com sucesso.', { variant: 'success' });
    } else {
      enqueueSnackbar('Erro ao enviar a proposta para o anúncio', { variant: 'error' });
    }

    setProposalModalOpen(false);
  };

  return (
    <>
      <BreadcrumbsItem to={match.url}>
        {address?.street}
      </BreadcrumbsItem>
      <Grid className={classes.carouselContainer} container direction="column" alignItems="center" marginBottom={5}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Carousel images={images} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12} sm={6} padding={5}>
          <Typography variant="h4">{address?.street}</Typography>
          <Typography variant="subtitle1">{`${address?.neighborhood}, ${address?.city}/${address?.state}`}</Typography>
          <Typography variant="body1">{advertisement.information}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} padding={5}>
          <Grid item marginBottom={5}>
            <Typography variant="h5">Aluguel: R${advertisement.rentAmount}</Typography>
          </Grid>
          <Grid item marginBottom={5}>
            {
              authUser?.id !== property?.userId && !proposalList?.some((proposal) => proposal.advertisementId === advertisement.id && proposal.userId === authUser?.id) ?
                <DefaultButton
                  variant="contained"
                  style={{ marginRight: 5 }}
                  onClick={handleOpenProposalModal}
                >
                  Fazer Proposta
                </DefaultButton> :
                null
            }
          </Grid>
        </Grid>
      </Grid>

      {/* Modal de Proposta */}
      <Dialog open={isProposalModalOpen} onClose={handleCloseProposalModal}>
        <DialogTitle>Fazer Proposta</DialogTitle>
        <DialogContent>
          <TextField
            label="Informação"
            fullWidth
            value={proposalInformation}
            onChange={(e) => setProposalInformation(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Valor da Proposta"
            fullWidth
            type="number"
            value={proposalRentAmount}
            onChange={(e) => setProposalRentAmount(parseFloat(e.target.value))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProposalModal}>Cancelar</Button>
          <Button onClick={handleSaveChanges}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withSnackbar(AdvertisementViewPage);
