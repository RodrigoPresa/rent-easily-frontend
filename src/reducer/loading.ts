import { Action } from "redux";
import { RootState } from ".";
import { store } from "..";

export const LOADING = 'LOADING';

interface LoadingAction extends Action {
    type: typeof LOADING;
    loading: boolean;
}

interface LoadingState {
    loading: number;
}

export function loadingAction(loading: boolean): LoadingAction {
    return {
        type: LOADING,
        loading
    };
}

const initialState: LoadingState = {
    loading: 0
}

export function loading(state = initialState, action: LoadingAction): LoadingState {
    switch (action.type) {
        case LOADING:
            return {
                loading: !!(action.loading) ? state.loading + 1 : (state.loading > 0 ? state.loading - 1 : 0)
            };
        default:
            return state;
    }
}

export function mapLoadingStateToProps(state: RootState) {
    const { loading } = state.loading;
    return {
        loading: loading > 0
    };
}

export type LoadingFunction = (loading: boolean) => any;

export interface WithLoadingProps {
    loadingAction: LoadingFunction;
}

export function useLoading() {
    return (loading: boolean) => {
        store.dispatch(loadingAction(loading));
    };
}

export default loading;