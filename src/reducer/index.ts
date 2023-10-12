import { combineReducers, } from 'redux';
import { authenticationReducer } from './Authentication';
import loading from './loading';
import { alertDialog } from './alertDialog';

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    loading,
    alertDialog
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;