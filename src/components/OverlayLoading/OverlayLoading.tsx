import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from "@mui/styles";
import React from "react";
import { connect } from 'react-redux';
import { mapLoadingStateToProps } from "../../reducer/loading";

interface CircularIndeterminateProps {
    loading: boolean;
    size?: number;
    zIndex?: number;
}

const useStyles = makeStyles((theme) => ({
    progress: {
        margin: theme.spacing(2),
    },
    overlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100000
    }
}));

export function OverlayLoading(props: CircularIndeterminateProps) {
    const { loading, size, zIndex } = props;

    const classes = useStyles();

    return loading ? (
        <div className={classes.overlay} style={{ zIndex }}>
            <CircularProgress className={classes.progress} size={size || 50} />
        </div>
    ) : null;
}

export default connect(mapLoadingStateToProps, null)(OverlayLoading);