import React, { useEffect } from 'react';
import * as Yup from 'yup';

import { FormControl } from '@mui/material';

import confirmation from '../../../components/ConfirmationDialog';
import DefaultButton from '../../../components/FormControl/DefaultButton';
import ErrorButton from '../../../components/FormControl/ErrorButton';
import { Trans, translate, withTranslate } from '../../../components/Translate';
import { objectEquals } from '../../../utils/util';
import { WithTranslateProps } from '../../Translate/withTranslate';
import FormContextProvider, { ChangeEvent, FormContextInterface, FormElement } from './FormContext';
import useTranslate from '../../Translate/useTranslate';

export type FormErrors<T extends Record<string, any>> = { [P in keyof T]?: React.ReactNode };
export type FormDirty<T extends Record<string, any>> = { [P in keyof T]?: boolean };

export type FormValidationSchema<T extends Record<string, any>> = { [P in keyof T]?: Yup.AnySchema };

function setFormError<T extends Record<string, any>, K extends keyof T & string>(errors: FormErrors<T>, field: K, errorMessage?: string) {
    errors[field] = errorMessage;
}

export async function validateSchema<T extends Record<string, any>>(values: T, validationSchema?: FormValidationSchema<T>): Promise<FormErrors<T>> {
    var errors: FormErrors<T> = {};
    if (validationSchema && typeof validationSchema === 'object') {
        const fields = Object.keys(values);
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            setFormError(errors, field, undefined);
            if (field in validationSchema) {
                var value = values[field];
                try {
                    var fieldValidationSchema = validationSchema[field];
                    if (typeof fieldValidationSchema === 'undefined') continue;
                    if (typeof fieldValidationSchema['describe'] === 'function') {
                        const hasRequired = fieldValidationSchema.describe().tests.findIndex(t => t.name === 'required') > -1;
                        if (!value && !hasRequired) {
                            continue;
                        }
                    }
                    await fieldValidationSchema.validate(value);
                } catch (e) {
                    if (e instanceof Error) {
                        setFormError(errors, field, e.message);
                    }
                }
            }
        }
    }
    return errors;
}

export interface FormToperSaveUndoButtonsProps extends WithTranslateProps {
    blocked?: boolean;
    onUndo: (() => void) | undefined;
    isSubmitting?: boolean;
    dirty: { [k: string]: boolean | undefined };
}

class FormToperSaveUndoButtonsC extends React.Component<FormToperSaveUndoButtonsProps> {

    constructor(props: FormToperSaveUndoButtonsProps) {
        super(props);
    }

    render() {
        const { blocked, isSubmitting, onUndo, dirty, t } = this.props;
        const isDirty = Object.getOwnPropertyNames(dirty).length > 0;

        return (
            <FormControl fullWidth variant="outlined" margin="dense" style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <DefaultButton type='submit' variant="contained" size='small' id="btnSave" disabled={blocked || isSubmitting}>
                    {onUndo ? <Trans translateKey="saveChanges" namespace="form" capitalize /> : <Trans translateKey="save" namespace="form" capitalize />}
                </DefaultButton>
                {onUndo && <ErrorButton variant="contained" size='small'
                    onClick={() => {
                        if (!isDirty) {
                            onUndo();
                        } else {
                            confirmation(undefined, {
                                title: t('confirmUndoChanges', { capitalize: true, namespace: 'form' }),
                                okLabel: t('yes', { capitalize: true }),
                                cancelLabel: t('no', { capitalize: true }),
                                onProceed: () => {
                                    onUndo();
                                }
                            });
                        }
                    }}
                    style={{ marginLeft: 10 }}
                >
                    <Trans translateKey="undoChanges" namespace="form" capitalize />
                </ErrorButton>}
            </FormControl>
        )
    }
}

export const FormToperSaveUndoButtons = withTranslate<FormToperSaveUndoButtonsProps>()(FormToperSaveUndoButtonsC);

export interface FormFooterAllButtonsProps {
    blocked?: boolean;
    onUndo?: (() => void) | undefined;
    isSubmitting?: boolean;
    dirty: { [k: string]: boolean | undefined };
    onBack: () => void;
    showSaveUndo: boolean;
}

export function FormFooterAllButtons(props: FormFooterAllButtonsProps) {
    const t = useTranslate();
    const { blocked, isSubmitting, onUndo, dirty, onBack, showSaveUndo } = props;
    const isDirty = Object.getOwnPropertyNames(dirty).length > 0;
    //const isDirty = (dirty ? Object.getOwnPropertyNames(dirty).length > 0 : false) || props.isDirty;
    
    useEffect(() => {
        let overlay_editng = document.getElementById("overlay_editng");
        if(overlay_editng){
            if(isDirty === true || (showSaveUndo === true && onUndo)){
                overlay_editng.style.display = 'block';
            } else {
                overlay_editng.style.display = 'none';
            }
        }
        return () => {
            if(overlay_editng){
                overlay_editng.style.display = 'none';
            }
        }
    }, [isDirty, showSaveUndo])

    return (
        <FormControl fullWidth variant="outlined" margin="dense" style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            {showSaveUndo &&
                <>
                    <DefaultButton type='submit' variant="contained" size='small' id="btnSave" disabled={blocked || isSubmitting}>
                        {onUndo ? <Trans translateKey="saveChanges" namespace="form" capitalize /> : <Trans translateKey="save" namespace="form" capitalize />}
                    </DefaultButton>
                    {onUndo && <ErrorButton variant="contained" size='small'
                        disabled={blocked || isSubmitting}
                        onClick={() => {
                            if (!isDirty) {
                                onUndo();
                            } else {// transformar todos em class para usar t()
                                confirmation(undefined, {
                                    title: t('confirmUndoChanges', { capitalize: true, namespace: 'form' }),
                                    okLabel: t('yes', { capitalize: true }),
                                    cancelLabel: t('no', { capitalize: true }),
                                    onProceed: () => {
                                        onUndo();
                                    }
                                });
                            }
                        }}
                        style={{ marginLeft: 10 }}
                    >
                        <Trans translateKey="undoChanges" namespace="form" capitalize />
                    </ErrorButton>}
                </>
            }
            {
                //saveOrUndoChanges form
            }
            <ErrorButton variant="contained" size='small' id="btnCancel"
                disabled={!!(showSaveUndo && onUndo)}
                title={!!(showSaveUndo && onUndo) ? t('saveOrUndoChanges', { capitalize: true, namespace: 'form' }) : ''}
                onClick={() => {
                    if (!isDirty) {
                        onBack();
                    } else {
                        confirmation(undefined, {
                            title: t('confirmSaveOrUndoChanges', { capitalize: true, namespace: 'form' }),
                            okLabel: t('yes', { capitalize: true }),
                            cancelLabel: t('no', { capitalize: true }),
                            onProceed: () => {
                                onBack();
                            }
                        });
                    }
                }}
                style={{ marginLeft: 10 }}
            >
                <Trans translateKey="back" capitalize />
            </ErrorButton>
        </FormControl>
    )
}

//export const FormFooterAllButtons = withTranslate<FormFooterAllButtonsProps>()(FormFooterAllButtonsC);

export interface FormFooterButtonsProps extends WithTranslateProps {
    blocked?: boolean;
    onCancel: () => void;
    isSubmitting?: boolean;
    dirty: { [k: string]: boolean | undefined };
}

class FormFooterButtonsC extends React.Component<FormFooterButtonsProps> {

    constructor(props: FormFooterButtonsProps) {
        super(props);
    }

    render() {
        const { blocked, isSubmitting, onCancel, dirty, t } = this.props;
        const isDirty = Object.getOwnPropertyNames(dirty).length > 0;

        return (
            <FormControl fullWidth variant="outlined" margin="dense" style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <DefaultButton type='submit' variant="contained" size='small' id="btnSave" disabled={blocked || isSubmitting}>
                    <Trans translateKey="save" namespace="form" capitalize />
                </DefaultButton>
                <ErrorButton variant="contained" size='small' id="btnCancel"
                    onClick={() => {
                        if (!isDirty) {
                            onCancel();
                        } else {
                            confirmation(undefined, {
                                title: t('confirmUndoChanges', { capitalize: true, namespace: 'form' }),
                                okLabel: t('yes', { capitalize: true }),
                                cancelLabel: t('no', { capitalize: true }),
                                onProceed: () => {
                                    onCancel();
                                }
                            });
                        }
                    }}
                    style={{ marginLeft: 10 }}
                >
                    <Trans translateKey="cancel" namespace="form" capitalize />
                </ErrorButton>
            </FormControl>
        )
    }
}

export const FormFooterButtons = withTranslate<FormFooterButtonsProps>()(FormFooterButtonsC);

export interface FormFooterBackButtonsProps extends WithTranslateProps {
    blocked?: boolean;
    onBack: () => void;
    isSubmitting?: boolean;
    dirty: { [k: string]: boolean | undefined };
}

class FormFooterBackButtonsC extends React.Component<FormFooterBackButtonsProps> {

    constructor(props: FormFooterBackButtonsProps) {
        super(props);
    }

    render() {
        const { blocked, isSubmitting, onBack, dirty, t } = this.props;
        const isDirty = Object.getOwnPropertyNames(dirty).length > 0;

        return (
            <FormControl fullWidth variant="outlined" margin="dense" style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <ErrorButton variant="contained" size='small' id="btnCancel"
                    onClick={() => {
                        if (!isDirty) {
                            onBack();
                        } else {
                            confirmation(undefined, {
                                title: t('confirmUndoChanges', { capitalize: true, namespace: 'form' }),
                                okLabel: t('yes', { capitalize: true }),
                                cancelLabel: t('no', { capitalize: true }),
                                onProceed: () => {
                                    onBack();
                                }
                            });
                        }
                    }}
                    style={{ marginLeft: 10 }}
                >
                    <Trans translateKey="back" capitalize />
                </ErrorButton>
            </FormControl>
        )
    }
}

export const FormFooterBackButtons = withTranslate<FormFooterBackButtonsProps>()(FormFooterBackButtonsC);

// const FunctionTrans = (props) => {
//     return props.t;
// }
// export const TransFormValidation = withTranslate({ namespace: 'form.validation' })(FunctionTrans);


export interface FormProps<T extends Record<string, any>> {
    style?: React.CSSProperties;
    initialValues: T;
    onSubmit: (values: T, dirty: FormDirty<T>, errors?: FormErrors<T>) => Promise<void> | void;
    validationSchema?: FormValidationSchema<T>;
    enableReinitialize?: boolean;
    validate?: (values: T) => Promise<FormErrors<T>>;
    postValidation?: (values: T) => Promise<FormErrors<T>>;
    children: React.FunctionComponent<FormContextInterface<T>>;
}

export interface FormState<T extends Record<string, any>> {
    values: T;
    errors: FormErrors<T>;
    dirty: FormDirty<T>;
    isSubmitting: boolean;
}

export default class Form<T extends Record<string, any>> extends React.Component<FormProps<T>, FormState<T>> {

    private mounted: boolean = false;

    constructor(props: FormProps<T>) {
        super(props);
        const { initialValues } = this.props;
        this.state = {
            values: initialValues || {},
            errors: {},
            dirty: {},
            isSubmitting: false,
        };

        this.sanitizeErrors = this.sanitizeErrors.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.onFormReset = this.onFormReset.bind(this);
        this.setFieldError = this.setFieldError.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.validateField = this.validateField.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
        this.clearField = this.clearField.bind(this);
        this.setValues = this.setValues.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.onCloseWindow = this.onCloseWindow.bind(this);
    }

    onCloseWindow(event: BeforeUnloadEvent) {
        let btnCancel = window.document.getElementById('btnCancel');
        if(btnCancel && btnCancel.getAttribute('disabled') !== null){
            event.preventDefault(); // Cancela o evento padrão do navegador
            event.returnValue = ''; // Define uma mensagem vazia (funciona em alguns navegadores)
        
            // Exibe a mensagem personalizada
            return 'É possível que as alterações feitas não sejam salvas.';
        }
    }

    componentDidMount() {
        this.mounted = true;
        window.addEventListener('beforeunload', this.onCloseWindow);
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener('beforeunload', this.onCloseWindow);
    }

    async componentDidUpdate(prevProps: FormProps<T>, prevState: FormState<T>) {
        const { initialValues, enableReinitialize } = this.props;
        if (!objectEquals(prevProps.initialValues, initialValues)) {
            if (enableReinitialize === true) {
                await this.setStateAsync({ values: initialValues });
            }
        }
    }

    async setStateAsync<K extends keyof FormState<T>>(state: Pick<FormState<T>, K>) {
        if (this.mounted) {
            await new Promise<void>(resolve => this.setState(state, resolve));
        }
    }

    getValues() {
        return this.state.values;
    }

    getErrors() {
        return this.state.errors;
    }

    sanitizeErrors(errors: FormErrors<T>): FormErrors<T> {
        var e: FormErrors<T> = {};
        if (errors && typeof errors === 'object') {
            var fields = Object.keys(errors);
            fields.forEach(field => {
                var error = errors[field];
                if (error) {
                    Object.assign(e, { [field]: error });
                }
            })
        }
        return e;
    }

    async onFormReset(event: React.FormEvent<HTMLFormElement>) {
        const { initialValues } = this.props;
        await this.setStateAsync({ values: initialValues, dirty: {}, errors: {} });
    }

    async formOnSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();

        var btnSubmit = event.currentTarget.querySelector('button[type=submit]');
        if (btnSubmit) {
            btnSubmit.setAttribute('disabled', 'true');
        }

        const { errors, values, dirty } = this.state;
        const { validate, postValidation, onSubmit, validationSchema } = this.props;
        await this.setStateAsync({ isSubmitting: true });
        var e: FormErrors<T> = {};
        var d: FormDirty<T> = {};
        Object.assign(e, errors, await validateSchema(values, validationSchema));
        if (typeof validate === 'function') {
            const er = await Promise.resolve(validate(values));
            if (er && typeof er === 'object') {
                Object.assign(e, er);
            }
        }
        if (typeof postValidation === 'function') {
            const err = await Promise.resolve(postValidation(values));
            Object.assign(e, err || {});
        }
        var finalErrors = this.sanitizeErrors(e);
        Object.assign(d, dirty || {});
        for (var ef in finalErrors) {
            d[ef] = true;
        }
        await this.setStateAsync({ errors: finalErrors, dirty: d });
        if (typeof onSubmit === 'function') {
            await Promise.resolve(onSubmit(values, d, Object.keys(finalErrors).length > 0 ? finalErrors : undefined));
        }

        window.setTimeout(async () => {
            await this.setStateAsync({ isSubmitting: false });
            if (btnSubmit) {
                btnSubmit.removeAttribute('disabled');
            }
        }, 500);
    }

    async setFieldError(field: string, errorMessage: string) {
        const { errors } = this.state;
        var e = {};
        Object.assign(e, errors, { [field]: errorMessage });
        await this.setStateAsync({ errors: e });
    }

    async validateField<K extends keyof T & string>(field: K, value: any) {
        const { validationSchema } = this.props;
        var error = undefined;
        if (validationSchema && typeof validationSchema === 'object') {
            if (field in validationSchema) {
                const validation = validationSchema[field];
                try {
                    await validation?.validate(value);
                } catch (e) {
                    if (e instanceof Error) {
                        error = e.message;
                    } else {
                        error = String(e);
                    }
                }
            }
        }
        return error;
    }

    async setErrors(errors: FormErrors<T>) {
        await this.setStateAsync({ errors });
    }

    async setValuesErrors(values: T) {
        const { validate, validationSchema } = this.props;
        var e = {};
        if (typeof validate === 'function') {
            const error = await Promise.resolve(validate(values));
            if (typeof error === 'object') {
                Object.assign(e, error);
            }
        }
        var schemaError = await validateSchema(values, validationSchema);
        Object.assign(e, schemaError);
        await this.setErrors(e);
    }

    async setValues(vals: Partial<T>) {
        const { values, dirty } = this.state;
        const keys = Object.keys(vals) as (keyof T)[];
        var v = Object.assign({}, values, vals);
        var d = Object.assign({}, dirty);
        keys.forEach(k => {
            d[k] = true;
        });
        await this.setValuesErrors(v);
        await this.setStateAsync({ values: v, dirty: d });
    }

    async setValueError<K extends keyof T & string>(field: K, value: any) {
        const { errors, values } = this.state;
        const { validate } = this.props;
        var e = Object.assign({}, errors, { [field]: null });
        var err = await this.validateField(field, value);
        if (err) {
            Object.assign(e, { [field]: err });
        }
        if (typeof validate === 'function') {
            const error = await Promise.resolve(validate(Object.assign({}, values, { [field]: value })));
            if (typeof error === 'object') {
                Object.assign(e, error);
            }
        }
        await this.setStateAsync({ errors: e });
    }

    async setFieldValue<K extends keyof T & string>(field: K, value: any) {
        const { values, dirty } = this.state;
        var v = Object.assign({}, values, { [field]: value });
        this.setValueError(field, value);
        await this.setStateAsync({ values: v, dirty: { ...dirty, [field]: true } });
    }

    async clearField<K extends keyof T & string>(field: K, value?: any) {
        const { values, dirty, errors } = this.state;
        var v = Object.assign({}, values);
        if (value !== undefined) {
            v[field] = value;
        } else {
            delete v[field];
        }
        var d = Object.assign({}, dirty);
        delete d[field];
        var e = Object.assign({}, errors, { [field]: null });
        await this.setStateAsync({ values: v, dirty: d, errors: e });
    }

    async handleChange<K = any>(event: ChangeEvent<K>) {
        if (event.target !== null) {
            const { name, value } = event.target;
            const field = name;
            if (field) {
                await this.setFieldValue(field, value);
            }
        }
    }

    async handleChangeNumber<K = any>(event: ChangeEvent<K>) {
        if (event.target !== null) {
            const { name, value } = event.target;
            const field = name;
            const re = /^[0-9\b]+$/;
            if (field) {
                if (typeof value === 'string' && (re.test(value) || value === '')) {
                    var numValue = parseInt(value);
                    await this.setFieldValue(field, isNaN(numValue) ? null : numValue);
                } else if (typeof value === 'number') {
                    await this.setFieldValue(field, isNaN(value) ? null : value);
                }
            }
        }
    }

    render() {
        const { style, children, initialValues } = this.props;
        var s = style || {};
        const { values, errors, isSubmitting, dirty } = this.state;
        return (
            <form
                autoComplete='off'
                onSubmit={this.formOnSubmit}
                onReset={this.onFormReset}
                style={{ display: 'flex', flex: 1, flexDirection: 'column', ...s }}
            >
                <FormContextProvider
                    initialValues={initialValues}
                    value={{
                        values,
                        setFieldValue: this.setFieldValue,
                        clearField: this.clearField,
                        handleChange: this.handleChange,
                        handleChangeNumber: this.handleChangeNumber,
                        setValues: this.setValues,
                        setErrors: this.setErrors,
                        errors,
                        dirty,
                        isSubmitting
                    }}>
                    {children}
                </FormContextProvider>
            </form>
        );
    }
}