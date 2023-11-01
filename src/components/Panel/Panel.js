import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import styles from './styles';
import { Paper, Typography, Divider } from '@mui/material';


class Panel extends React.Component {
    render() {
        const { classes, panelHeaderTitle, panelHeaderMiddle, panelHeaderButtons, panelHeaderTabs, children, panelFooterButtons, style, elevation, componentPanelBodyStyle } = this.props;

        return (
            <>
                <Paper className={classes.componentPanel} square={true} elevation={elevation ? elevation : 0} style={{ ...style }}>
                    <div className={classes.componentPanelHeader}>
                        {panelHeaderTitle &&
                            <div className={classes.componentPanelHeaderTitle}>
                                <Typography variant="h6" className={classes.componentPanelHeaderTitle}>{panelHeaderTitle}</Typography>
                            </div>
                        }
                        {panelHeaderMiddle &&
                            <div className={classes.componentPanelHeaderMiddle}>
                                {panelHeaderMiddle}
                            </div>
                        }
                        {panelHeaderButtons && <div className={classes.componentPanelHeaderIcons}>
                            {panelHeaderButtons}
                        </div>
                        }
                    </div>

                    {panelHeaderTabs && <div className={classes.componentPanelHeader}>
                        {panelHeaderTabs}
                    </div>
                    }

                    {panelHeaderTitle || panelHeaderButtons || panelHeaderMiddle || panelHeaderTabs ? <Divider className={classes.divider} /> : null}

                    <div className={classes.componentPanelBody} style={{ ...componentPanelBodyStyle }}>
                        {children}
                    </div>

                    {panelFooterButtons ?
                        (
                            <>
                                <Divider className={classes.divider} />
                                <div className={classes.componentPanelFooter}>
                                    {panelFooterButtons &&
                                        <div className={classes.componentPanelFooterButtons}>
                                            {panelFooterButtons}
                                        </div>
                                    }
                                </div>
                            </>
                        ) : null}

                </Paper>

            </>
        );
    }
}

Panel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'Panel' })(Panel);