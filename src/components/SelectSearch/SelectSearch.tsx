import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import OptionItem from './OptionItem';
import { objectEquals, removerAcentos } from '../../utils/util';

interface SelectSearchProps<T, Name extends string = any> {
    id?: string | undefined;
    name: Name;
    label: React.ReactNode;
    options: OptionItem<T>[];
    //isMulti?: Boolean;
    isClearable?: boolean;
    value: T | null;
    isDisabled?: boolean;
    onChangeHandle: (name: Name, value: T | null) => void;
    error?: boolean;
    required?: boolean;
    visible?: boolean;
    helperText?: React.ReactNode;
    placeholder?: string;
    noOptionsText?: string;
    autoFocus?: boolean;
    margin?: 'none' | 'dense' | 'normal';
    //variant?: 'standard' | 'filled' | 'outlined';
    fullWidth?: boolean;
    //classes: Record<keyof ReturnType<typeof styles>, string>
}

class SelectSearch<T, Name extends string = any> extends React.Component<SelectSearchProps<T, Name>> {

    constructor(props: SelectSearchProps<T, Name>) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e: React.ChangeEvent<any>, value: T | null) {
        const { onChangeHandle, name } = this.props;
        if (typeof onChangeHandle === 'function') {
            onChangeHandle(name, value);
        }
    }

    getOptionSelected(option: T, value: T): boolean {
        return objectEquals(option, value);
    }

    getOptionLabel(option: T): string {
        const { options, value } = this.props;
        var item = options.find(o => objectEquals(o.value, option));
        if (item) {
            var isSelected = value !== null && this.getOptionSelected(item.value, value);
            return item.label;
        }
        return "";
    }

    getOptionDisabled(valueO: T): boolean {
        const { options, isDisabled, value } = this.props;
        var option = options.find(o => o.value === valueO);
        if(isDisabled && option?.value !== value) return true;
        return option?.disabled || false;
    }

    render() {
        var { options, name, label, id, error, helperText, required, visible, value, isDisabled, isClearable, margin, fullWidth, placeholder, autoFocus, noOptionsText } = this.props;

        var disableClearable = !isClearable || required;
        const key = options.reduce<string>((p, o) => p + "|" + o.label, name);
        return (
            <Autocomplete<T, false, boolean, false>
                key={key}
                style={{ display: visible === false ? 'none' : undefined }}
                id={id}
                options={options.map(o => o.value)}
                value={value}
                isOptionEqualToValue={(option, value) => this.getOptionSelected(option, value)}
                noOptionsText={noOptionsText || "Nenhuma opção"}
                getOptionLabel={v => this.getOptionLabel(v)}
                getOptionDisabled={v => this.getOptionDisabled(v)}
                onChange={this.handleChange}
                disabled={!!isDisabled}
                placeholder={placeholder}
                autoComplete={true}
                disableClearable={disableClearable}
                ListboxProps={{
                    className: 'nonDraggable'
                }}
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
                        required={required}
                        onBlur={(ev) => {
                            var val = removerAcentos(ev.target.value.toUpperCase());
                            var op = options.filter((opt) => removerAcentos(opt.label.toUpperCase()).includes(val) && val.length > 2);
                            if (op.length === 1) {
                                var opValue = op[0].value;
                                if (value !== opValue) {
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

export default SelectSearch;