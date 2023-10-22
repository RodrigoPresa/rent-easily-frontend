import React from 'react';
import { Divider, FormControl, FormGroup as MuiFormGroup, FormLabel } from '@mui/material';

interface FormGroupProps {
    label: string;
    divider?: boolean;
}

export default class FormGroup extends React.Component<FormGroupProps>{
    render() {
        const { children, divider, label } = this.props;
        return (
            <>
                {!!divider && <Divider />}
                <FormControl margin='dense' variant='standard' fullWidth>
                    <FormLabel className='MuiInputLabel-shrink' focused filled>{label}</FormLabel>
                    <MuiFormGroup style={{ paddingTop: 4 }}>
                        {children}
                    </MuiFormGroup>
                </FormControl>
            </>
        )
    }
}

