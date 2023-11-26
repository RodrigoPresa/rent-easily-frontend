import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import PropertyAddress from '../../../model/PropertyAddress';
import Advertisement from '../../../model/Advertisement';

export interface AdvertisementViewProps {
  id: number;
  imageUrl: string;
  address: PropertyAddress | undefined;
  advertisement: Advertisement;
  onFavoriteClick: () => void;
  isFavorite: boolean;
}

const AdvertisementView: React.FC<AdvertisementViewProps> = ({
  id,
  imageUrl,
  address,
  advertisement,
  onFavoriteClick,
  isFavorite
}) => {

  const history = useHistory();

  const onAdvertisementClick = () => {
    return history.push({
      pathname: `/system/advertisement/view/${id}`,
      state: {
        imageUrl,
        address,
        advertisement,
        onFavoriteClick,
        isFavorite
      }
    });
  };

  return (
    <>
      {
        address !== undefined &&
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
                    {address?.street ?? ""}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {`${address?.neighborhood ?? ""}, ${address?.city ?? ""}/${address?.state ?? ""}`}
                  </Typography>
                  <Typography variant="body1" color="green" fontWeight='bold' component="div">
                    R${advertisement.rentAmount}
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
      }
    </>
  );
};

export default AdvertisementView;
