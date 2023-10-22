import React from 'react';
import MaskedInput2 from 'react-text-mask';
import TextField, { OutlinedTextFieldProps } from '@mui/material/TextField';
import { CSSProperties } from 'react';
import { ChangeEvent } from 'react';

type MaskArray = Array<string | RegExp>;

export interface MaskedInputProps {
    name: string;
    label: string;
    value: string;
    margin?: 'none' | 'dense' | 'normal';
    size?: 'small' | 'medium';
    variant?: 'standard' | 'filled' | 'outlined';
    onChange(event: any): any;
    onKeyDown?: (event: any) => any;
    autoFocus?: boolean | undefined;
    fullWidth?: boolean | undefined;
    required?: boolean | undefined;
    disabled?: boolean | undefined;
    guide?: boolean | undefined;
    error?: boolean | undefined;
    showMask?: boolean | undefined;
    style?: CSSProperties;
    helperText?: React.ReactNode;
    invalidFormatMessage?: React.ReactNode;
    mask: MaskArray | ((value: string) => MaskArray);
}

export default function MaskedInput(props: MaskedInputProps) {
    const { name, label, value, onChange, fullWidth, required, autoFocus, error, helperText, 
        invalidFormatMessage, showMask, style, disabled, mask, guide, margin, size, variant,
         onKeyDown } = props;

    return (
        <MaskedInput2
            mask={mask}
            showMask={showMask}
            guide={guide}
            style={style}
            name={name}
            value={value}
            disabled={disabled}            
            onChange={(e) => onChange(e)}
            render={(ref, props) => (
                <TextField
                    inputRef={ref}
                    {...props}
                    label={label}
                    margin={margin || 'none'}
                    variant={variant || 'standard'}
                    size={size || 'small'}
                    fullWidth={fullWidth}
                    required={required}
                    autoFocus={autoFocus}
                    error={error}
                    helperText={helperText}
                    onKeyDown={onKeyDown}
                />
            )}
        />
    );
}