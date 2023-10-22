import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { loadingAction } from "../../reducer/loading";
import { RouteChildrenProps, useHistory } from "react-router-dom";
import { RootState } from "../../reducer";
import { AuthenticationState, logoutAction, successLoginAction } from "../../reducer/Authentication";
import AuthService from "../../services/AuthService";
import { PermissionError } from "../../services/Errors";
import SignUpForm from "./SignUpForm";

interface SignUpPageProps extends AuthenticationState, RouteChildrenProps {
    successLoginAction: typeof successLoginAction;
    logoutAction: typeof logoutAction;
    loadingAction: typeof loadingAction;
}

export interface SignUpRequest {
    fullName: string;
    cpf: string;
    income: number;
    registerType: string;
    mail: string;
    password: string;
}

function SignUpPage(props: SignUpPageProps) {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        verifyAuth();
    }, []);

    useEffect(() => {
        verifyAuth();
    });

    function verifyAuth() {
        const { loggedIn } = props;
        if (loggedIn) {
            history.push('/');
        }
    }

    async function onSignUp({ fullName, cpf, income, registerType, mail, password }: SignUpRequest) {
        const { successLoginAction, loadingAction, logoutAction } = props;
        try {
            // Cadastrar usuário
            const result = await AuthService.instance.signUp(fullName, cpf, income, registerType, mail, password);

            // Logar usuário
            if (result) {
                loadingAction(true);
                const user = await AuthService.instance.login(mail, password);
                if (user) {
                    successLoginAction(user);
                }
            }
        } catch (e) {
            let errorMsg = '';
            if (e instanceof Error) {
                errorMsg = e.message;
            } else {
                errorMsg = e instanceof Error ? e.message : String(e);
                if (e instanceof Error && e.cause === 401) {
                    errorMsg = `${e.message}`;
                } else {
                    errorMsg = 'Erro de comunicação com o servidor';
                }
            }
            setErrorMessage(errorMsg);
            logoutAction();
        } finally {
            loadingAction(false);
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1
            }}
        >
            <SignUpForm
                onSubmit={onSignUp}
                errorMessage={errorMessage}
            />
        </div>
    );
}


function mapStateToProps(state: RootState) {
    const { authentication } = state;
    return authentication;
}

const mapDispatchToProps = {
    loadingAction,
    successLoginAction,
    logoutAction
};

const connected = connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
export default connected;