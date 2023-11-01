const styles = theme => ({
    componentPanel: {
        padding: theme.spacing(2),
        paddingBottom: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        overflowY: 'auto'
    },
    componentPanelBody: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
    },
    componentPanelHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    componentPanelHeaderTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minWidth: 200,
        height: 32,
    },
    componentPanelHeaderMiddle: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1
    },
    componentPanelHeaderIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        //flex: 1,
        height: 32,
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    componentPanelFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: theme.spacing(1)
    },
    componentPanelFooterButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
});

export default styles;