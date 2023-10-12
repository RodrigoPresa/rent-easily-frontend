import React from 'react';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { mapAlertDialogStateToProps, closeAlertDialog } from '../reducer/alertDialog';

class AlertDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(e) {
        const { closeAlertDialog } = this.props;
        closeAlertDialog();
    }

    render() {
        const { alertTitle, alertContent, alertOpen } = this.props;
        return (
            <Dialog
                open={alertOpen}
                aria-labelledby="responsive-dialog-title"
                maxWidth='md'
            >
                {alertTitle && <DialogTitle id="responsive-dialog-title">{alertTitle}</DialogTitle>}
                <DialogContent>
                    {typeof alertContent === 'string'
                        ? <DialogContentText style={{ minWidth: 320 }}>
                            {alertContent}
                        </DialogContentText>
                        : alertContent}
                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={this.handleButtonClick} color="primary" variant='contained' autoFocus>Ok</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(mapAlertDialogStateToProps, { closeAlertDialog })(AlertDialog);