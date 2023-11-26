import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Property from '../../../model/Property';

export interface PropertyViewProps {
  id: number;
  property: Property;
}

const PropertyView: React.FC<PropertyViewProps> = ({
  id,
  property
}) => {

  const history = useHistory();

  const onPropertyClick = () => {
    return history.push({
      pathname: `/system/properties/view/${id}`,
      state: {
        property
      }
    });
  };

  return (
    <>
      {
        property.address !== undefined &&
        <Grid container direction="row" alignItems="center">
          <Grid item xs={12} sm={12} md={12} lg={12} >
            <Card sx={{ display: 'flex', flexDirection: 'row', margin: 2, cursor: 'pointer' }}>
              <CardMedia
                component="img"
                sx={{ width: 151 }}
                image="https://s2.glbimg.com/CS6ziQq57qk1F18WhdJoRWDjT8s=/e.glbimg.com/og/ed/f/original/2021/08/09/materiais-naturais-valorizam-a-decoracao-dessa-casa-de-1000-m2-6.jpg"
              />
              <Box onClick={onPropertyClick}>
                <CardContent>
                  <Typography component="div" variant="h5">
                    {`${property.address?.street}, ${property.address?.streetNumber}` ?? ""}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {`${property.address?.neighborhood ?? ""}, ${property.address?.city ?? ""}/${property.address?.state ?? ""}`}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>
      }
    </>
  );
};

export default PropertyView;
