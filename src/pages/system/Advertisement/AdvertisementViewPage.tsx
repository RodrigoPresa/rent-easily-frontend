import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Panel from "../../../components/Panel";
import { Button, Grid, Typography } from "@mui/material";
import PanelBodyContent from "../../../components/Panel/PanelBodyContent";
import AdvertisementView, { AdvertisementViewProps } from "./AdvertisementView";
import Carousel from "../../../components/Carousel";
import { makeStyles } from "@mui/styles";
import DefaultButton from "../../../components/DefaultButton";

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

const AdvertisementViewPage: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const { imageUrl, title, address, price, onFavoriteClick, isFavorite } = location.state as AdvertisementViewProps;

  return (
    <>
      <Panel
        panelHeaderTitle=""
      >
        <PanelBodyContent>
          <Grid className={classes.carouselContainer} container direction="column" alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Carousel images={images} />
            </Grid>
          </Grid>
          <Grid container direction="column" alignItems="center" marginTop={5}>
            <Typography variant="h4">{title}</Typography>
            <Typography variant="subtitle1">{address}</Typography>
          </Grid>
          <Grid container direction="row" justifyContent='center' alignItems="center" marginTop={5}>
            <Grid item xs={12} sm={12} md={6} lg={6} textAlign='center' margin={2}>
              <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque viverra venenatis massa nec scelerisque. Suspendisse rutrum felis nec nulla rutrum sagittis. Integer tristique non lacus ac ultricies. Proin erat felis, tincidunt ut accumsan a, consequat nec est. Donec tristique ligula in erat facilisis volutpat varius pharetra lacus. Morbi eu erat sit amet nibh mollis porttitor at ac orci. Sed bibendum, velit sed luctus egestas, ex ipsum venenatis est, a tempus nisi tellus eget mi.</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} textAlign='center' margin={5}>
              <Typography variant="h5">R${price}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} textAlign='center' margin={5}>
              <DefaultButton variant="contained">Fazer Proposta</DefaultButton>
            </Grid>
          </Grid>
        </PanelBodyContent>
      </Panel >
    </>
  );
};

export default AdvertisementViewPage;
