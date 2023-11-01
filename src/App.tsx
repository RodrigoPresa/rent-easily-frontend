import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.scss';
import { HashRouter, Switch, Route, Redirect, RouteChildrenProps } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import OverlayLoading from './components/OverlayLoading/OverlayLoading';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import AlertDialog from './components/AlertDialog';
import { ThemeBlue } from './themes/ThemeBlue';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { ContextMenuProvider } from './components/ContextMenu/ContextMenuProvider';
import { ptBR, enUS, es } from "date-fns/locale";
import { AuthenticationState, logoutAction, mapAuthenticationStateToProps, successLoginAction } from './reducer/Authentication';
import AuthService from './services/AuthService';
import Settings from './services/Settings';
import System from './pages/system';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from './pages/signUp/SignUpPage';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme { }
}


moment.defineLocale('pt-br', {
    months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
    monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
    weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
    weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    weekdaysMin: 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY [às] LT',
        LLLL: 'dddd, D [de] MMMM [de] YYYY [às] LT',
        LTS: 'HH:mm:ss'
    },
    relativeTime: {
        future: 'em %s',
        past: '%s atrás',
        s: 'segundos',
        m: 'um minuto',
        mm: '%d minutos',
        h: 'uma hora',
        hh: '%d horas',
        d: 'um dia',
        dd: '%d dias',
        M: 'um mês',
        MM: '%d meses',
        y: 'um ano',
        yy: '%d anos'
    },
    ordinal: (number: number) => `${number}º`
});

let lang = window.navigator.languages[0].toLowerCase();
if (moment.locales().indexOf(lang) >= 0) {
    moment.locale(lang);
}

var dateLocale = ptBR;
if (lang.startsWith('es')) {
    dateLocale = es;
} else if (lang.startsWith('en')) {
    dateLocale = enUS;
}

interface InitialAppProps extends RouteChildrenProps, AuthenticationState {

}

const Loading = () => <h5>Loading...</h5>;

class InitialApp extends Component<InitialAppProps> {

    componentDidMount() {
        let { loggedIn, history, authUser } = this.props;
        // if (loggedIn) {
        //     history.push('/system');
        // } else {
        //     history.push('/login');
        // }
        history.push('/system');
    }

    render() {
        return <Loading />;
    }
}

const ConnectedInitialApp = connect(mapAuthenticationStateToProps)(InitialApp);

interface PrivateRouteProps extends AuthenticationState {
    path: string;
    component: React.ComponentType<RouteChildrenProps>;
}

const PrivateRoute = connect(mapAuthenticationStateToProps)((props: PrivateRouteProps) => {
    const { component: Component, loggedIn, ...rest } = props;
    return (
        <Route
            {...rest}
            render={props =>
                loggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
})


interface AppProps {
    successLoginAction: typeof successLoginAction,
    logoutAction: typeof logoutAction
}

interface AppState {
    loaded: boolean;
}

class App extends Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    async componentDidMount() {
        await this.getSettings();
        await this.verifyAuth();
        this.setState({ loaded: true });
    }

    async verifyAuth() {
        var { successLoginAction, logoutAction } = this.props;
        var user = await AuthService.instance.getAuthUser();
        if (user) {
            successLoginAction(user);
        } else {
            await AuthService.instance.logout();
            logoutAction();
        }
    }

    async getSettings() {
        try {
            const response = await fetch('Settings.json?q=' + Date.now());
            if (response.ok) {
                const settings = await response.json();
                Settings.set(settings);
            }
        } catch (e) {
            console.error('getSettings', e);
        }
    }

    render() {
        const { loaded } = this.state;
        // if (loaded === false) {
        //     return <Loading />;
        // }
        return (
            <div className="App">
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={ThemeBlue}>
                        <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
                            <ContextMenuProvider>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocale}>
                                    <OverlayLoading />
                                    <AlertDialog />
                                    <HashRouter>
                                        <Switch>
                                            <Route exact path="/" component={ConnectedInitialApp} />
                                            <Route exact path="/login" component={LoginPage} />
                                            <Route exact path="/signUp" component={SignUpPage} />
                                            <Route path="/system" component={System} />
                                            <Route render={() => <Redirect to="/" />} />
                                        </Switch>
                                    </HashRouter>
                                </LocalizationProvider>
                            </ContextMenuProvider>
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </div>
        );
    }
}

const mapDispatchToProps = {
    successLoginAction, logoutAction
};

export default connect(null, mapDispatchToProps)(App);