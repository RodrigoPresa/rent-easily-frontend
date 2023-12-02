import { Button, FormControl, FormHelperText, Menu, MenuItem, Paper, Select, SelectChangeEvent, Theme } from '@mui/material';
import TextField from '@mui/material/TextField';
import { withTheme } from "@mui/styles";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from '../../images/logo.png';
import { SignUpRequest } from './SignUpPage';
import DefaultButton from '../../components/DefaultButton';
import MaskedInput from '../../components/FormControl/MaskedInput';
import SelectSearch from '../../components/SelectSearch';
import { Trans } from '../../components/Translate';

interface SignUpFormProps {
    onSubmit: (data: SignUpRequest) => any;
    theme: Theme;
    errorMessage: string | null;
}

interface SignUpFormState {
    fullName: string;
    cpf: string;
    income: number;
    registerType: string;
    mail: string;
    password: string;
}

class SignUpForm extends Component<SignUpFormProps, SignUpFormState> {

    constructor(props: SignUpFormProps) {
        super(props);
        this.state = {
            fullName: '',
            cpf: '',
            income: 0,
            registerType: 'lesse',
            mail: '',
            password: ''
        }

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onUsernameChangeHandler = this.onUsernameChangeHandler.bind(this);
        this.onCpfChangeHandler = this.onCpfChangeHandler.bind(this);
        this.onIncomeChangeHandler = this.onIncomeChangeHandler.bind(this);
        this.onRegisterTypeChangeHandler = this.onRegisterTypeChangeHandler.bind(this);
        this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
        this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    }

    onUsernameChangeHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = ev.target.value;
        this.setState({
            fullName: value
        });
    }

    onCpfChangeHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = ev.target.value;
        this.setState({
            cpf: value
        });
    }

    onIncomeChangeHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = parseInt(ev.target.value);
        this.setState({
            income: value
        });
    }

    onRegisterTypeChangeHandler(ev: SelectChangeEvent<string>) {
        var value = ev.target.value;
        this.setState({
            registerType: value
        });
    }

    onEmailChangeHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = ev.target.value;
        this.setState({
            mail: value
        });
    }
    
    onPasswordChangeHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = ev.target.value;
        this.setState({
            password: value
        });
    }

    onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (typeof this.props.onSubmit === 'function') {
            const { fullName, cpf, income, registerType, mail, password } = this.state;
            this.props.onSubmit({ fullName, cpf, income, registerType, mail, password });
        }
    }

    render() {
        const { errorMessage, theme } = this.props;
        const { fullName, cpf, income, registerType, mail, password } = this.state;
        const margin = theme.spacing(3);
        return <>
            <Paper style={{ width: '90%', maxWidth: 400, padding: margin, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', paddingBottom: margin }}>
                    <img src={Logo} alt="Logo" width='100%' height='auto' />
                </div>
                <form onSubmit={this.onSubmitHandler} style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        label='Nome completo'
                        onChange={this.onUsernameChangeHandler}
                        value={fullName}
                        autoFocus={true}
                        variant="standard"
                        margin="normal"
                        size='small'
                        required
                    />
                    <MaskedInput
                        mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                        name="cpf"
                        label='CPF'
                        required
                        fullWidth
                        value={cpf}
                        onChange={this.onCpfChangeHandler}
                        variant="standard"
                        margin="normal"
                        size='small'
                    />
                    <TextField
                        label='Renda mensal'
                        onChange={this.onIncomeChangeHandler}
                        value={income}
                        type='number'
                        variant="standard"
                        margin="normal"
                        size='small'
                        required
                    />
                    <Select
                        name="registerType"
                        label={"Tipo de cadastro"}
                        onChange={this.onRegisterTypeChangeHandler}
                        variant="standard"
                        value={registerType}
                        style={{margin: "20px 0 10px 0"}}
                        required
                        fullWidth
                    >
                        <MenuItem key="menuitem-lessee" value="lesse">Locatário</MenuItem>
                        <MenuItem key="menuitem-lessor" value="lessor">Locador</MenuItem>
                    </Select>
                    <TextField
                        label='E-Mail'
                        onChange={this.onEmailChangeHandler}
                        value={mail}
                        style={{ paddingBottom: margin }}
                        variant="standard"
                        margin="normal"
                        size='small'
                        required
                    />
                    <TextField
                        label='Senha'
                        onChange={this.onPasswordChangeHandler}
                        value={password}
                        style={{ paddingBottom: margin }}
                        variant="standard"
                        margin="normal"
                        size='small'
                        required
                    />
                    <FormControl variant="standard" margin='normal'>
                        <DefaultButton type="submit" variant='contained' color='primary' style={{ marginBottom: 10 }}>Cadastrar</DefaultButton>
                    </FormControl>
                </form>
                {errorMessage && <FormHelperText error={true}>{errorMessage}</FormHelperText>}
            </Paper>
        </>;
    }
}

export default withTheme<Theme, typeof SignUpForm>(SignUpForm);