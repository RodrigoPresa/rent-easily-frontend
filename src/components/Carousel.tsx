import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';

interface CarouselProps {
    images: string[];
}

const useStyles = makeStyles(() => ({
    carouselContainer: {
        backgroundColor: "white",
        margin: "15px 0",
    },
    carousel: {
        width: "800px",
        height: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundSize: "cover",
        backgroundPosition: "center"
    },
    img: {
        width: "100%",
        height: "100%"
    },
}));

const Carousel: React.FC<CarouselProps> = ({ images }) => {
    const classes = useStyles();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const carouselStyle = {
        backgroundImage: `url(${images[currentIndex]})`,
    };

    return (
        <div className={classes.carouselContainer}>
            <div className={classes.carousel} style={carouselStyle}>
                <Grid item xs={2} sm={2} md={2} lg={2} >
                    <Button onClick={prevSlide}><FontAwesomeIcon icon={faCircleChevronLeft} color='#eceff3' size='2xl'/></Button>
                </Grid>
                <Grid item xs={8} sm={8} md={8} lg={8} ></Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} textAlign="end">
                    <Button onClick={nextSlide}><FontAwesomeIcon icon={faCircleChevronRight} color='#eceff3' size='2xl'/></Button>
                </Grid>

            </div>
        </div>
    );
};

export default Carousel;
