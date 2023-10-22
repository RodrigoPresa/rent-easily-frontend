import React from 'react';
import { FormErrors, FormDirty } from './Form';

export interface FormElement {
    id?: string,
    name: string;
    value: unknown
};

export type ChangeEvent<T = any> = { target: { value: T; name: string } };

export interface FormContextInterface<T extends Object> {
    values: T,
    setValues: (vals: Partial<T>) => Promise<any>,
    setFieldValue: <K extends keyof T & string>(field: K, value: T[K]) => Promise<any>,
    clearField: <K extends keyof T & string>(field: K, value?: T[K]) => Promise<any>,
    setErrors: (errors: FormErrors<T>) => Promise<any>,
    //setFieldError: (field: keyof T, errorMessage: string) => any,
    errors: FormErrors<T>,
    handleChange: (event: ChangeEvent) => any,
    handleChangeNumber: (event: ChangeEvent) => any,
    isSubmitting: boolean,
    dirty: FormDirty<T>
}

// export function withFormContext(Component) {
//     return (props) => (
//         <FormContext.Consumer>
//             {(context) => (
//                 <Component {...props} {...context} />
//             )}
//         </FormContext.Consumer>
//     )
// }

interface FormContextProps<T extends Object> {
    value: FormContextInterface<T>,
    initialValues: T,
    children: React.FunctionComponent<FormContextInterface<T>>
}

class FormContextProvider<T extends Object> extends React.Component<FormContextProps<T>>{

    public ctx: React.Context<FormContextInterface<T>>

    constructor(props: FormContextProps<T>) {
        super(props);
        const { initialValues } = this.props;
        this.ctx = React.createContext<FormContextInterface<T>>({
            values: initialValues,
            setValues: async (values) => { },
            setFieldValue: async (field, value) => { },
            clearField: async (field, value) => { },
            setErrors: async (errors) => { },
            //setFieldError: (field, erroMessage) => { },
            errors: {},
            handleChange: (event) => { },
            handleChangeNumber: (ev) => { },
            isSubmitting: false,
            dirty: {}
        });
    }

    render() {
        const { children, value } = this.props;
        const Ctx = this.ctx;
        return (
            <Ctx.Provider value={value}>
                <Ctx.Consumer>
                    {children}
                </Ctx.Consumer>
            </Ctx.Provider>
        );
    }
}

export default FormContextProvider;