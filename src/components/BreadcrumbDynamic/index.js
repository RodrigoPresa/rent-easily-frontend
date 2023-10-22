import React from "react";
import { Paper, Link } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { Breadcrumbs } from 'react-breadcrumbs-dynamic';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * 
 * @param {import("@mui/material").Theme} theme 
 */
function BreadcrumbStyles(theme) {
    return {
        root: {
            marginBottom: theme.spacing(1),
            padding: theme.spacing(2)
        },
        container: {
            fontFamily: theme.typography.fontFamily,
            display: 'flex',
            paddingLeft: theme.spacing(1),
            "& span": {
                display: 'flex',
                alignItems: 'center'
            },
            "& span button": {
                fontSize: 14,
                [theme.breakpoints.down('md')]: {
                    fontSize: 12,
                }
            },
            "& button": {
                fontSize: 14,
                [theme.breakpoints.down('md')]: {
                    fontSize: 12,
                }
            },
            "& span svg": {
                margin: '0px 5px',
            },
        },
        item: {
            lineHeight: '20px'
        }
    }
}

function BreadcrumbDynamic(props) {

    const { classes } = props;

    const BreadcrumbContainer = (({ children }) => (
        <div className={classes.container}>{children}</div>
    ));

    const BreadcrumbLink = withRouter((props) => {
        const { children, match, history, location, to, staticContext, ...others } = props;
        return (
            <Link
                className={classes.item}
                color='textPrimary'
                component="button"
                onClick={() => {
                    history.push(to);
                }}
                {...others}
            >
                {children}
            </Link>
        );
    });

    return (
        <Paper elevation={0} square={true} className={classes.root}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                item={BreadcrumbLink}
                container={BreadcrumbContainer}
                finalProps={{
                    style: { fontWeight: 'bold' }
                }}
            />
        </Paper>
    );

}


export default withStyles(BreadcrumbStyles)(BreadcrumbDynamic);