import { useSelector } from 'react-redux';
import { Action } from 'redux';
import { RootState } from '.';
import User from '../model/User';
import { AuthResponse } from '../services/AuthService';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const PERMISSIONS_SUCCESS = 'PERMISSIONS_SUCCESS';

var token = localStorage.getItem("authTokens");
const authToken = token ? JSON.parse(token) as AuthResponse : null;

const initialState: AuthenticationState = {
    loggedIn: !!(authToken?.accessToken),
    authUser: authToken?.user
};

export function successLoginAction(authUser: User): LoginAction {
    return {
        type: LOGIN_SUCCESS,
        payload: {
            authUser,
            loggedIn: true
        }
    };
}

export function logoutAction(): LogoutAction {
    return {
        type: LOGOUT,
        payload: {
            authUser: undefined,
            loggedIn: false
        }
    }
}

export interface AuthenticationAction extends Action {
    payload?: AuthenticationState
}

export interface LoginAction extends AuthenticationAction {
    type: typeof LOGIN_SUCCESS
}

export interface LogoutAction extends AuthenticationAction {
    type: typeof LOGOUT
}

export interface AuthenticationState {
    loggedIn?: boolean;
    authUser?: User;
}

export function mapAuthenticationStateToProps(state: RootState) {
    return state.authentication;
}

export function useAuthentication(): AuthenticationState {
    return useSelector((root: RootState) => root.authentication);
}

export function authenticationReducer(state = initialState, action: AuthenticationAction): AuthenticationState {
    const { type, payload } = action;
    switch (type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                authUser: payload?.authUser,
                loggedIn: true
            };
        case LOGOUT:
            return {
                ...state,
                authUser: undefined,
                loggedIn: false,
            };
        default:
            return state;
    }
}

