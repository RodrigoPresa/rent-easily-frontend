import { Typography } from '@mui/material';
import MainPage from '../../images/mainpage.jpeg';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
    divStyle: {
        backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8)), url(${MainPage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
    },
    textContainer: {
        marginLeft: '10%',
        color: '#211b15',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    text: {
        fontSize: '3rem',
        textShadow: '1px 1px 2px black',
    },
}));

const SystemRootPage = () => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.divStyle}>
                <div className={classes.textContainer}>
                    <Typography className={classes.text} variant="h3">Do seu jeito, no seu tempo.</Typography>
                    <Typography className={classes.text} variant="h3">Alugar agora é simples!</Typography>
                </div>
            </div>
        </>
    );
};

export default SystemRootPage;