import React from 'react';
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ButtonProps } from '@mui/material/Button';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import ErrorButton from './FormControl/ErrorButton';
import SuccessButton from './FormControl/SuccessButton';
import { ThemeBlue } from "../themes/ThemeBlue";
import { Trans } from '../components/Translate';

interface ConfirmationOptions {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | false;
    fullWidth?: boolean;
    okLabel?: React.ReactNode;
    cancelLabel?: React.ReactNode;
    confirmation?: React.ReactNode;
    title?: React.ReactNode;
    onProceed?: () => Promise<any> | any;
    onCancel?: () => any;
    component?: React.ReactElement
    disableBackdropClick?: boolean
    disableEscapeKeyDown?: boolean
}

interface ConfirmationDialogProps {
    options: ConfirmationOptions,
    ProceedButton?: React.ComponentType<ButtonProps>
}

export class ConfirmationDialog extends React.Component<ReactConfirmProps & ConfirmationDialogProps> {

    render() {
        const { show, proceed, dismiss, cancel, confirmation, options, children, ProceedButton } = this.props;
        const { maxWidth, fullWidth, okLabel, cancelLabel, title, onProceed, onCancel, component, disableBackdropClick, disableEscapeKeyDown } = options || {};
        const OkButton = ProceedButton || SuccessButton;
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={ThemeBlue}>
                    <Dialog
                        open={show}
                        aria-labelledby="responsive-dialog-title"
                        onClose={(ev, r) => {
                            if (r === 'backdropClick' && disableBackdropClick === true) return;
                            dismiss();
                        }}
                        maxWidth={maxWidth || false}
                        fullWidth={fullWidth || false}
                        disableEscapeKeyDown={disableEscapeKeyDown || false}
                        PaperProps={{
                            style: {
                                overflowY: 'unset'
                            }
                        }}
                    >
                        {title && <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>}
                        <DialogContent style={{ overflowY: 'unset' }}>
                            {confirmation ?
                                <DialogContentText>
                                    {confirmation}
                                </DialogContentText> :
                                (component || children)}
                        </DialogContent>
                        <DialogActions>
                            <OkButton
                                size='small'
                                variant='contained'
                                onClick={async () => {
                                    if (typeof onProceed === 'function') {
                                        if ((await Promise.resolve(onProceed())) === false) {
                                            return;
                                        }
                                    }
                                    if (typeof proceed === 'function') {
                                        proceed('ok');
                                    }
                                }}
                                autoFocus>
                                {okLabel || 'OK'}
                            </OkButton>
                            <ErrorButton
                                size='small'
                                variant='contained'
                                onClick={() => {
                                    if (typeof onCancel === 'function') {
                                        onCancel();
                                    }
                                    if (typeof onCancel !== 'function') {
                                        dismiss();
                                    }
                                }} >
                                {cancelLabel || 'Cancelar'}
                            </ErrorButton>
                        </DialogActions>
                    </Dialog>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}

const ConfirmableDialog = confirmable<ConfirmationDialogProps>(ConfirmationDialog);

let confirm: any = createConfirmation(ConfirmableDialog, 400);
const app: HTMLElement | null = document.querySelector('.App');
if (app){
    confirm = createConfirmation(ConfirmableDialog, 400, app);
}

export default function confirmation(confirmation?: React.ReactNode, options: Omit<ConfirmationOptions, 'confirmation'> = {}) {
    // You can pass whatever you want to the component. These arguments will be your Component's props
    return confirm({ confirmation, options });
}
