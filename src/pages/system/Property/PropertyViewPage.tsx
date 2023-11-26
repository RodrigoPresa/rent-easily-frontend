import React, { useState } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { PropertyViewProps } from "./PropertyView";
import { makeStyles } from "@mui/styles";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useAuthentication } from "../../../reducer/Authentication";
import { ServiceApi } from "../../../services/ServiceApi";
import Property from "../../../model/Property";
import Carousel from "../../../components/Carousel";
import DefaultButton from "../../../components/DefaultButton";
import { CheckBox } from "@mui/icons-material";
import Checkbox from "../../../components/TableList/Checkbox";

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

const PropertyViewPage: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const match = useRouteMatch();

  const { property } = location.state as PropertyViewProps;
  const { authUser } = useAuthentication();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  // const [editedInformation, setEditedInformation] = useState(advertisement.information);
  // const [editedRentAmount, setEditedRentAmount] = useState(advertisement.rentAmount);

  const service = new ServiceApi<Property>('property');

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleSaveChanges = async () => {
    // const result = await service.update(advertisement.id, {
    //   information: editedInformation,
    //   rentAmount: editedRentAmount,
    // });

    setCreateModalOpen(false);
  };


  return (
    <>
      <BreadcrumbsItem to={match.url}>
        {property.address?.street}
      </BreadcrumbsItem>
      <Grid className={classes.carouselContainer} container direction="column" alignItems="center" marginBottom={5}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Carousel images={images} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12} sm={6} padding={5}>
          <Typography variant="h4">{property.address?.street}</Typography>
          <Typography variant="subtitle1">{`${property.address?.neighborhood}, ${property.address?.city}/${property.address?.state}`}</Typography>
          <Typography variant="body1">{property.description}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} padding={5}>
          <Grid item marginBottom={5}>
            <Typography variant="h5">Registro: <span style={{ color: 'blue', fontWeight: 'bold' }}>{property.registryId}</span></Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Modal de Cadastro */}
      <Dialog open={isCreateModalOpen} onClose={handleCloseCreateModal}>
        <DialogTitle>Cadastrar imóvel</DialogTitle>
        <DialogContent>
          <TextField
            label="Informação"
            fullWidth
            value={""}
            onChange={() => { }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal}>Cancelar</Button>
          <Button onClick={handleSaveChanges}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PropertyViewPage;
