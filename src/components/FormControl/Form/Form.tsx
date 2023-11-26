import { FormControl } from '@mui/material';
import React from 'react';
import * as Yup from 'yup';
import confirmation from '../../ConfirmationDialog';
import DefaultButton from '../DefaultButton';
import ErrorButton from '../ErrorButton';
import { Trans } from '../../Translate';
import useTranslate from '../../Translate/useTranslate';
import FormContextProvider, { ChangeEvent, FormContextInterface } from './FormContext';
import { objectEquals } from '../../../utils/util';

export type FormErrors<T extends Record<string, any>> = { [P in keyof T]?: React.ReactNode };
export type FormDirty<T extends Record<string, any>> = { [P in keyof T]?: boolean };

type AnySchema = Yup.AnySchema<any, any, any>;

export type FormValidationSchema<T extends Record<string, any>> = { [P in keyof T]?: AnySchema };

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

export interface FormSaveUndoButtonsProps {
    blocked?: boolean;
    onUndo: (() => void) | undefined;
    isSubmitting?: boolean;
    dirty: Record<string, boolean | undefined>;
}

export function FormSaveUndoButtons(props: FormSaveUndoButtonsProps) {

    const t = useTranslate();

    const { blocked, isSubmitting, onUndo, dirty } = props;
    const isDirty = Object.getOwnPropertyNames(dirty).length > 0;

    return (
        <>{isDirty ? <FormControl fullWidth variant="outlined" margin="dense" style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <DefaultButton type='submit' variant="contained" size='small' id="btnSave" disabled={blocked || isSubmitting}>
                {onUndo ? <Trans translateKey="saveChanges" namespace="form" capitalize /> : <Trans translateKey="save" namespace="form" capitalize />}
            </DefaultButton>
            {onUndo && <ErrorButton variant="contained" size='small' id="btnUndo"
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
        </FormControl> : null}</>
    )
}

export interface FormFooterAllButtonsProps {
    blocked?: boolean;
    onUndo: (() => void) | undefined;
    isSubmitting?: boolean;
    dirty?: Record<string, boolean | undefined>;
    onBack: () => void;
    isDirty?: boolean;
    form?: string;
}

export function FormFooterAllButtons(props: FormFooterAllButtonsProps) {
    const { blocked, isSubmitting, onUndo, dirty, onBack, form } = props;
    const isDirty = (dirty ? Object.getOwnPropertyNames(dirty).length > 0 : false) || props.isDirty;

    const formId = form || 'general_form';

    function handleSubmit(btnAction: string) {
        let formElement = document.getElementById(formId);
        if (formElement) {
            formElement.setAttribute('submitType', btnAction);
        }
    }

    return (
        <FormControl fullWidth variant="outlined" margin="dense" style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            {isDirty &&
                <>
                    <DefaultButton form={formId} onClick={() => handleSubmit('save')} style={{ marginLeft: 10 }} type={'submit'} variant="contained" size='small' id="btnSave" name="btnSave" value="btnSave" disabled={blocked || isSubmitting}>
                        Salvar
                    </DefaultButton>
                    {onUndo && <ErrorButton variant="contained" size='small' id="btnUndo"
                        disabled={blocked || isSubmitting}
                        onClick={() => {
                            confirmation(undefined, {
                                title: 'Deseja desfazer as alterações?',
                                okLabel: 'Sim',
                                cancelLabel: 'Não',
                                onProceed: () => {
                                    onUndo();
                                }
                            });
                        }}
                        style={{ marginLeft: 10 }}
                    >
                        Cancelar
                    </ErrorButton>}
                </>
            }
            <ErrorButton variant="contained" size='small' id="btnCancel"
                disabled={!!(isDirty && onUndo && !blocked)}
                title={!!(isDirty && onUndo) ? 'Salve ou desfaça as alterações antes de voltar' : ''}
                onClick={() => {
                    if (!isDirty || blocked) {
                        onBack();
                    } else {
                        confirmation(undefined, {
                            title: 'Todas as alterações serão perdidas, deseja mesmo sair?',
                            okLabel: 'Sim',
                            cancelLabel: 'Não',
                            onProceed: () => {
                                onBack();
                            }
                        });
                    }
                }}
                style={{ marginLeft: 10 }}
            >
                Cancelar
            </ErrorButton>
        </FormControl>
    )
}

export interface FormFooterButtonsProps {
    blocked?: boolean;
    onCancel: () => void;
    isSubmitting?: boolean;
    dirty?: Record<string, boolean | undefined>;
    isDirty?: boolean;
    form?: string;
}

export function FormFooterButtons(props: FormFooterButtonsProps) {
    const t = useTranslate();

    const { blocked, isSubmitting, onCancel, dirty, form } = props;
    const isDirty = (dirty ? Object.getOwnPropertyNames(dirty).length > 0 : false) || props.isDirty;

    return (
        <FormControl fullWidth variant="outlined" margin="dense" style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <DefaultButton type='submit' form={form} variant="contained" size='small' id="btnSave" disabled={blocked || isSubmitting}>
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

export interface FormFooterBackButtonsProps {
    blocked?: boolean;
    onBack: () => void;
    isSubmitting?: boolean;
    dirty: Record<string, boolean | undefined>;
}

export function FormFooterBackButtons(props: FormFooterBackButtonsProps) {

    const t = useTranslate();

    const { blocked, isSubmitting, onBack, dirty } = props;
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

export interface FormFooterTestButtonsProps {
    onConfirm: () => void;
    onBack: () => void;
    isConfirmBtnVisible: boolean;
}

export function FormFooterTestButtons(props: FormFooterTestButtonsProps) {

    const t = useTranslate();

    const { onBack, onConfirm, isConfirmBtnVisible } = props;

    return (
        <FormControl fullWidth variant="outlined" margin="dense" style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <>
                {
                    isConfirmBtnVisible &&
                    <DefaultButton variant="contained" size='small' id="btnConfirm"
                        onClick={() => {
                            confirmation(undefined, {
                                title: t('confirmEndTest', { capitalize: true, namespace: 'tests' }),
                                okLabel: t('yes', { capitalize: true }),
                                cancelLabel: t('no', { capitalize: true }),
                                onProceed: () => {
                                    onConfirm();
                                }
                            });
                        }}
                        style={{ marginLeft: 10 }}
                    >
                        <Trans translateKey="endTest" namespace="tests" capitalize />
                    </DefaultButton>
                }
            </>
            <ErrorButton variant="contained" size='small' id="btnCancel"
                onClick={() => { onBack(); }}
                style={{ marginLeft: 10 }}
            >
                <Trans translateKey="back" capitalize />
            </ErrorButton>
        </FormControl>
    )
}

export interface FormProps<T extends Record<string, any>> {
    style?: React.CSSProperties;
    initialValues: T;
    onSubmit: (values: T, dirty: FormDirty<T>, errors?: FormErrors<T>, submitType?: string | null) => Promise<void> | void;
    onChange?: (changed: boolean) => any;
    validationSchema?: FormValidationSchema<T>;
    enableReinitialize?: boolean;
    validate?: (values: T) => Promise<FormErrors<T>>;
    postValidation?: (values: T) => Promise<FormErrors<T>>;
    children: React.FunctionComponent<FormContextInterface<T>>;
    id?: string;
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
        this.reset = this.reset.bind(this);
        this.validateField = this.validateField.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
        this.clearField = this.clearField.bind(this);
        this.setValues = this.setValues.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeFloat = this.handleChangeFloat.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
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

    async reset() {
        const { initialValues, onChange } = this.props;
        await this.setStateAsync({ values: initialValues, dirty: {}, errors: {} });
        onChange?.call(this, false);
    }

    async onFormReset(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        await this.reset();
    }

    async formOnSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();

        let submitType = event.currentTarget.getAttribute('submitType');

        var btnsSubmit = document.querySelectorAll('button[type=submit]');
        if (btnsSubmit) {
            btnsSubmit.forEach((btnSubmit) => {
                btnSubmit.setAttribute('disabled', 'true');
            });
        }

        var btnUndo = document.getElementById('btnUndo');
        if (btnUndo) {
            btnUndo.setAttribute('disabled', 'true');
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
            await Promise.resolve(onSubmit(values, d, Object.keys(finalErrors).length > 0 ? finalErrors : undefined, submitType));
        }

        window.setTimeout(async () => {
            await this.setStateAsync({ isSubmitting: false });
            if (btnsSubmit) {
                btnsSubmit.forEach((btnSubmit) => {
                    btnSubmit.removeAttribute('disabled');
                });
                if (btnUndo) {
                    btnUndo.removeAttribute('disabled');
                }
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
        const { onChange } = this.props;
        const { values, dirty } = this.state;
        const keys = Object.keys(vals) as (keyof T)[];
        var v = Object.assign({}, values, vals);
        var d = Object.assign({}, dirty);
        keys.forEach(k => {
            d[k] = true;
        });
        await this.setValuesErrors(v);
        await this.setStateAsync({ values: v, dirty: d });
        onChange?.call(this, true);
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
        const { onChange } = this.props;
        const { values, dirty } = this.state;
        var v = Object.assign({}, values, { [field]: value });
        this.setValueError(field, value);
        await this.setStateAsync({ values: v, dirty: { ...dirty, [field]: true } });
        onChange?.call(this, true);
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

    async handleChangeFloat<K = any>(event: ChangeEvent<K>) {
        if (event.target !== null) {
            const { name, value } = event.target;
            const field = name;
            const re = /^[0-9]+([.][0-9]+)?$/;
            if (field) {
                if (typeof value === 'string' && (re.test(value) || value === '')) {
                    var numValue = value === '' ? NaN : Number(value);
                    await this.setFieldValue(field, isNaN(numValue) ? null : numValue);
                } else if (typeof value === 'number') {
                    await this.setFieldValue(field, isNaN(value) ? null : value);
                }
            }
        }
    }

    render() {
        const { style, children, initialValues, id } = this.props;
        var s = style || {};
        const { values, errors, isSubmitting, dirty } = this.state;
        return (
            <form
                id={id || 'general_form'}
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
                        // handleChangeFloat: this.handleChangeFloat,
                        setValues: this.setValues,
                        setErrors: this.setErrors,
                        // reset: this.reset,
                        errors,
                        dirty,
                        isSubmitting
                    }}>
                    {children}
                </FormContextProvider>
            </form >
        );
    }
}