import { Action } from "redux";
import { RootState } from ".";
import { store } from "..";

export const OPEN_ALERT_DIALOG = 'OPEN_ALERT_DIALOG';
export const CLOSE_ALERT_DIALOG = 'CLOSE_ALERT_DIALOG';

interface AlertState {
    title: string;
    content: React.ReactNode;
    open: boolean;
}

const initialState: AlertState = {
    title: '',
    content: '',
    open: false
}

interface OpenAlertDialogAction extends Action {
    type: typeof OPEN_ALERT_DIALOG,
    title: string,
    content: React.ReactNode
}

interface CloseAlertDialogAction extends Action {
    type: typeof CLOSE_ALERT_DIALOG,
}

type AlertActionTypes = OpenAlertDialogAction | CloseAlertDialogAction;

export function openAlertDialog(title: string, content: React.ReactNode): OpenAlertDialogAction {
    return {
        type: OPEN_ALERT_DIALOG,
        title,
        content,
    };
}

export function closeAlertDialog(): CloseAlertDialogAction {
    return {
        type: CLOSE_ALERT_DIALOG
    };
}

export function alertDialog(state = initialState, action: AlertActionTypes): AlertState {
    switch (action.type) {
        case OPEN_ALERT_DIALOG:
            return {
                title: action.title,
                content: action.content,
                open: true
            };
        case CLOSE_ALERT_DIALOG:
            return initialState;
        default:
            return state;
    }
}

export function mapAlertDialogStateToProps(state: RootState) {
    const { title, content, open } = state.alertDialog;
    return {
        alertTitle: title,
        alertContent: content,
        alertOpen: open
    };
}


export type AlertFunction = (title: string, content: React.ReactNode) => any;

export interface WithAlertProps {
    openAlertDialog: AlertFunction;
}

export function useAlert(): AlertFunction {
    return (title: string, content: React.ReactNode) => {
        store.dispatch(openAlertDialog(title, content));
    };
}
