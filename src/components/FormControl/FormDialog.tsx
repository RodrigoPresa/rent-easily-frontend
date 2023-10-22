import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    ThemeProvider,
    Theme,
    StyledEngineProvider,
} from '@mui/material';
import Form, { FormProps } from './Form/Form';
import { ThemeBlue } from "./../../themes/ThemeBlue";

export interface FormDialogProps<T extends Record<string, any>> extends FormProps<T> {
    show: boolean;
    dismiss: () => void;
    minWidth?: number | string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    fullHeight?: boolean;
    title?: React.ReactNode;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    className?: string;
}

export default function FormDialog<T extends Record<string, any>>(props: FormDialogProps<T>) {
    const { title, show, dismiss, maxWidth, fullWidth, disableBackdropClick, disableEscapeKeyDown, fullHeight,
        onSubmit, initialValues, enableReinitialize, validate, validationSchema, postValidation, style, children, minWidth, className } = props;
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={ThemeBlue}>
                <Dialog
                    open={!!show}
                    aria-labelledby="responsive-dialog-title"
                    onClose={(ev, reason) => {
                        if (reason === 'backdropClick' && disableBackdropClick === true) return;
                        dismiss();
                    }}
                    maxWidth={maxWidth || false}
                    fullWidth={fullWidth || false}
                    disableEscapeKeyDown={disableEscapeKeyDown || false}
                    PaperProps={{
                        style: {
                            overflowY: 'unset',
                            height: fullHeight === true ? '100%' : undefined,
                            minWidth: minWidth,
                        }
                    }}
                    className={className}
                >
                    {title && <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>}
                    <DialogContent style={{ overflowY: 'unset', display: 'flex', flexDirection: 'column' }}>
                        <Form<T>
                            style={style}
                            onSubmit={onSubmit}
                            postValidation={postValidation}
                            initialValues={initialValues}
                            enableReinitialize={enableReinitialize}
                            validate={validate}
                            validationSchema={validationSchema}>
                            {children}
                        </Form>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

