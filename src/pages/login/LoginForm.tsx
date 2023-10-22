import { Button, FormControl, FormHelperText, Paper, Theme } from '@mui/material';
import TextField from '@mui/material/TextField';
import { withTheme } from "@mui/styles";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from '../../images/logo.png';
import { LoginRequest } from './LoginPage';
import DefaultButton from '../../components/DefaultButton';

interface LoginFormProps {
    onSubmit: (data: LoginRequest) => any;
    theme: Theme;
    errorMessage: string | null;
}

interface LoginFormState {
    username: string;
    password: string;
    passwordError: boolean;
}

class LoginForm extends Component<LoginFormProps, LoginFormState> {

    constructor(props: LoginFormProps) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passwordError: false
        }

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onUsernameChangeHandler = this.onUsernameChangeHandler.bind(this);
        this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    }

    onUsernameChangeHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = ev.target.value;
        this.setState({
            username: value
        });
    }

    onPasswordChangeHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            password: ev.target.value,
            passwordError: ev.target.value === ''
        });
    }

    onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (typeof this.props.onSubmit === 'function') {
            const { username, password } = this.state;
            this.props.onSubmit({ mail: username, password });
        }
    }

    render() {
        const { errorMessage, theme } = this.props;
        const { username, password, passwordError } = this.state;
        const margin = theme.spacing(3);
        return <>
            <Paper style={{ width: '90%', maxWidth: 400, padding: margin, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', paddingBottom: margin }}>
                    <img src={Logo} alt="Logo" width='100%' height='auto' />
                </div>
                <form onSubmit={this.onSubmitHandler} style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        label='Login ou e-mail'
                        onChange={this.onUsernameChangeHandler}
                        value={username}
                        style={{ paddingBottom: margin }}
                        autoFocus={true}
                        autoComplete='off'
                        variant="standard"
                        margin="none"
                        size='small'
                        required
                    />
                    <TextField
                        label='Senha'
                        onChange={this.onPasswordChangeHandler}
                        value={password}
                        type='password'
                        style={{ paddingBottom: margin }}
                        error={passwordError}
                        autoComplete='off'
                        variant="standard"
                        margin="none"
                        size='small'
                        required
                    />
                    <FormControl variant="standard">
                        <DefaultButton type="submit" variant='contained' color='primary' style={{ marginBottom: 10 }}>Login</DefaultButton>
                    </FormControl>
                </form>
                {errorMessage && <FormHelperText error={true}>{errorMessage}</FormHelperText>}
                <br />
                <span style={{ textAlign: 'center' }}>Não tem uma conta? <Link to='/signUp' style={{ textDecoration: 'none' }} >Cadastre-se</Link></span>
            </Paper>
        </>;
    }
}

export default withTheme<Theme, typeof LoginForm>(LoginForm);