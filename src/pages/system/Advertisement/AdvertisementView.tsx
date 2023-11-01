import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Card, CardActions, CardContent, CardMedia, Divider, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import AdvertisementViewPage from './AdvertisementViewPage';


export interface AdvertisementViewProps {
  id: number;
  imageUrl: string;
  title: string;
  address: string;
  price: number;
  onFavoriteClick: () => void;
  isFavorite: boolean;
}

const AdvertisementView: React.FC<AdvertisementViewProps> = ({
  id,
  imageUrl,
  title,
  address,
  price,
  onFavoriteClick,
  isFavorite
}) => {

  const history = useHistory();

  const onAdvertisementClick = () => {
    return history.push({
      pathname: `/system/advertisement/view/${id}`,
      state: {
        imageUrl,
        title,
        address,
        price,
        onFavoriteClick,
        isFavorite
      }
    });
  };

  return (
    <>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={12} >
          <Card sx={{ display: 'flex', flexDirection: 'column', margin: 2 }}>
            <Box onClick={onAdvertisementClick}>
              <CardMedia
                sx={{ height: 400 }}
                component="img"
                image={imageUrl}
                alt="Imagem do Imóvel"
              />
              <CardContent>
                <Typography component="div" variant="h5">
                  {title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  {address}
                </Typography>
                <Typography variant="body1" color="green" fontWeight='bold' component="div">
                  R${price}
                </Typography>
              </CardContent>
            </Box>
            <CardActions sx={{ display: 'flex' }}>
              <IconButton onClick={onFavoriteClick}>
                <FontAwesomeIcon size={'1x'} color={isFavorite ? 'gold' : 'gray'} icon={faStar} />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default AdvertisementView;
