import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import OptionItem from './OptionItem';
import { Trans } from '../Translate';
import { Paper } from '@mui/material';
import { objectEquals, removerAcentos } from '../../utils/util';

interface SelectSearchAsyncProps<T> {
    id?: string | undefined;
    name: string;
    label: React.ReactNode;
    loadOptions: (inputValue: string) => Promise<OptionItem<T>[]>;
    defaultOptions: OptionItem<T>[];
    //isMulti?: Boolean;
    isClearable?: boolean;
    value: T | null;
    isDisabled?: Boolean;
    onChangeHandle: (name: string, value: T | null) => void;
    error?: Boolean;
    required?: Boolean;
    helperText?: React.ReactNode;
    placeholder?: string;
    autoFocus?: boolean;
    margin?: 'none' | 'dense' | 'normal';
    //variant?: 'standard' | 'filled' | 'outlined';
    fullWidth?: boolean;
    //classes: Record<keyof ReturnType<typeof styles>, string>
}

interface SelectSearchAsyncState<T> {
    options: OptionItem<T>[];
    loading: boolean;
}

class SelectSearchAsync<T> extends React.Component<SelectSearchAsyncProps<T>, SelectSearchAsyncState<T>>{

    timer?: number;

    constructor(props: SelectSearchAsyncProps<T>) {
        super(props);
        const { defaultOptions, value } = this.props;
        this.state = {
            options: defaultOptions || [],
            loading: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    private handleChange(e: React.ChangeEvent<any>, value: T | null) {
        const { onChangeHandle, name } = this.props;
        if (typeof onChangeHandle === 'function') {
            onChangeHandle(name, value);
        }
    }

    private async loadOptions(text: string) {
        const { loadOptions } = this.props;
        this.setState({ loading: true, options: [] });
        const options = await loadOptions(text);
        this.setState({ loading: false, options });
    }

    private async onTextChange(text: string, reason: 'input' | 'reset' | 'clear') {
        const { name, onChangeHandle } = this.props;
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        if (text.length === 0 || text.length > 2) {
            if (reason === 'input') {
                this.timer = window.setTimeout(async () => {
                    await this.loadOptions(text);
                }, 300);
            } else if (reason === 'clear') {
                if (typeof onChangeHandle === 'function') {
                    onChangeHandle(name, null);
                }
                await this.loadOptions(text);
            }
        }
    }

    render() {
        var { name, label, id, error, helperText, required, defaultOptions, value, isDisabled, isClearable, margin, fullWidth, placeholder, autoFocus } = this.props;
        const { options, loading } = this.state;

        var disableClearable = !isClearable || !!required;
        return (
            <Autocomplete<T, false, boolean, false>
                id={id}
                PaperComponent={PaperComponent}
                options={options.map(({ value }) => value)}
                loading={loading}
                value={value}
                isOptionEqualToValue={(a, b) => objectEquals(a, b)}
                loadingText="Loading..."
                getOptionLabel={v => {
                    const option = options?.find(({ value }) => objectEquals(v, value));
                    return option?.label || '';
                }}
                onChange={this.handleChange}
                onInputChange={(e, value, reason) => this.onTextChange(value, reason)}
                disableClearable={disableClearable}
                disabled={!!isDisabled}
                placeholder={placeholder}
                autoComplete={true}
                filterOptions={(t, { inputValue }) => inputValue.length == 0 || inputValue.length > 2 ? t : []}
                noOptionsText={<Trans translateKey="noOptions" capitalize />}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name={name}
                        label={label}
                        margin={margin || "normal"}
                        variant='outlined'
                        error={!!error}
                        helperText={helperText}
                        fullWidth={!!fullWidth}
                        autoFocus={autoFocus}
                        required={!!required}
                        InputProps={{
                            ...params.InputProps,
                            autoFocus: autoFocus,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                        onBlur={(ev) => {
                            var val = removerAcentos(ev.target.value.toUpperCase());
                            var op = options.filter((opt) => removerAcentos(opt.label.toUpperCase()).includes(val) && val.length > 2);
                            if (op.length === 1) {
                                var opValue = op[0].value;
                                if (op && value !== opValue) {
                                    this.handleChange(ev, opValue);
                                }
                            }
                        }}
                    />
                )}
            />
        );
    }
}

function PaperComponent(props: React.HTMLAttributes<HTMLElement>) {
    return <Paper {...props} elevation={8} />;
}

export default <T,>(props: SelectSearchAsyncProps<T>) => {
    const key = props.defaultOptions.reduce((p, o) => p + "|" + o.label, props.name);
    return <SelectSearchAsync<T> key={key} {...props} />
};