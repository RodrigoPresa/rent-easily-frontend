import { WithSnackbarProps, withSnackbar } from "notistack";
import Property from "../../../model/Property";
import { StatesArray } from "../../../utils/StatesArray";
import React from "react";
import { Grid, Box, Typography, TextField, Divider } from "@mui/material";
import Form, { FormDirty, FormErrors, FormFooterAllButtons } from "../../../components/FormControl/Form/Form";
import Panel from "../../../components/Panel";
import PanelBodyFormContent from "../../../components/Panel/PanelBodyFormContent";
import SelectSearch from "../../../components/SelectSearch";
import { withTranslate } from "../../../components/Translate";
import { ServiceApi } from "../../../services/ServiceApi";
import { WithTranslateProps } from "../../../components/Translate/withTranslate";

export interface PropertyFormData {
    description: string;
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    streetNumber: number;
    zipCode: string;
}

export interface PropertyFormState {
    loadedModelList: boolean;
    propertyList: Property[];
    isDirty: boolean;
}

export interface PropertyFormProps extends WithSnackbarProps, WithTranslateProps {
    property: Property | null;
    onSubmit: (data: PropertyFormData, isDirty: boolean) => any;
    onCancel: () => any;
    onChange?: (changed: boolean) => any;
    editing: boolean;
    isDisabled: boolean;
    undoChanges: (() => void) | undefined;
    goToPropertyEditLink?: (property: Property) => void;
}

const states = StatesArray(true);

class PropertyForm extends React.Component<PropertyFormProps, PropertyFormState> {

    private service: ServiceApi<Property>;

    constructor(props: PropertyFormProps) {
        super(props);
        this.state = {
            loadedModelList: false,
            propertyList: [],
            isDirty: false
        }

        this.service = new ServiceApi<Property>('property');

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.setFieldValueAltering = this.setFieldValueAltering.bind(this);
        this.setChanges = this.setChanges.bind(this);
    }

    async onSubmitHandler(values: PropertyFormData, dirty: FormDirty<PropertyFormData>, errors?: FormErrors<PropertyFormData>) {
        const { enqueueSnackbar, onSubmit } = this.props;
        var isDirty = false;
        var dirtyValues = Object.values(dirty);
        for (var key in dirtyValues) {
            var dirtyValue = dirtyValues[key];
            if (dirtyValue) {
                isDirty = true;
            }
        }
        if (errors) {
            var errorValues = Object.values(errors);
            for (var key in errorValues) {
                var error = errorValues[key];
                if (error) {
                    enqueueSnackbar(error, { variant: 'error' });
                }
            }
            return;
        }
        onSubmit(values, isDirty);
    }

    setFieldValueAltering(name: string, eventVal: any, setFieldValue: any) {
        setFieldValue(name, eventVal);
    }

    setChanges(changed: boolean) {
        const { onChange } = this.props;
        this.setState({ isDirty: changed });
        if (onChange)
            onChange(changed);
    }

    render() {

        const { property, onCancel, editing, undoChanges, isDisabled } = this.props;
        const { propertyList, isDirty } = this.state;

        const initialValues: PropertyFormData = {
            street: property?.address?.street ?? '',
            streetNumber: property?.address?.streetNumber ?? 0,
            neighborhood: property?.address?.neighborhood ?? '',
            city: property?.address?.city ?? '',
            state: property?.address?.state ?? '',
            zipCode: property?.address?.zipCode ?? '',
            country: property?.address?.country ?? '',
            description: property?.description ?? ''
        };

        return (
            <>
                <Panel
                    panelHeaderTitle={'Cadastro de Imóvel'}
                    panelFooterButtons={<FormFooterAllButtons blocked={isDisabled} onUndo={undoChanges} onBack={onCancel} isDirty={isDirty} />}
                >
                    <PanelBodyFormContent style={{ overflow: 'auto' }}>
                        <Grid container direction="row" alignItems="center" spacing={1}>
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                <Form<PropertyFormData>
                                    initialValues={initialValues}
                                    onSubmit={this.onSubmitHandler}
                                    enableReinitialize={true}
                                    onChange={this.setChanges}
                                >
                                    {({ isSubmitting, values, errors, handleChange, setFieldValue, dirty }) => {
                                        return (
                                            <>
                                                <Grid container marginBottom={2}>
                                                    <TextField
                                                        name="description"
                                                        label="Descrição"
                                                        multiline={true}
                                                        fullWidth
                                                        value={values.description}
                                                        onChange={(e) => this.setFieldValueAltering("description", e.target.value, setFieldValue)}
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Divider />
                                                <Box marginBottom={2} marginTop={2}>
                                                    <Typography variant='subtitle2'>
                                                        Endereço
                                                    </Typography>
                                                </Box>
                                                <Grid container marginBottom={2} spacing={2}>
                                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <TextField
                                                            name="street"
                                                            label="Rua"
                                                            fullWidth
                                                            value={values.street}
                                                            onChange={(e) => this.setFieldValueAltering("street", e.target.value, setFieldValue)}
                                                            margin="dense"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                                        <TextField
                                                            name="streetNumber"
                                                            label="Número"
                                                            fullWidth
                                                            value={values.streetNumber}
                                                            onChange={(e) => this.setFieldValueAltering("streetNumber", parseInt(e.target.value), setFieldValue)}
                                                            margin="dense"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                                        <TextField
                                                            name="zipCode"
                                                            label="CEP"
                                                            fullWidth
                                                            value={values.zipCode}
                                                            onChange={(e) => this.setFieldValueAltering("zipCode", e.target.value, setFieldValue)}
                                                            margin="dense"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <TextField
                                                            name="neighborhood"
                                                            label="Bairro"
                                                            fullWidth
                                                            value={values.neighborhood}
                                                            onChange={(e) => this.setFieldValueAltering("neighborhood", e.target.value, setFieldValue)}
                                                            margin="dense"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={9} sm={9} md={9} lg={9}>
                                                        <TextField
                                                            name="city"
                                                            label="Cidade"
                                                            fullWidth
                                                            value={values.city}
                                                            onChange={(e) => this.setFieldValueAltering("city", e.target.value, setFieldValue)}
                                                            margin="dense"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3} sm={3} md={3} lg={3}>
                                                        <SelectSearch<string | null>
                                                            name='state'
                                                            label="Estado"
                                                            value={values.state}
                                                            onChangeHandle={(_, e) => this.setFieldValueAltering("state", e, setFieldValue)}
                                                            options={states}
                                                            margin='dense'
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        );
                                    }}
                                </Form>
                            </Grid>
                        </Grid>
                    </PanelBodyFormContent>
                </Panel>
            </>
        );
    }
}

export default withSnackbar(withTranslate<PropertyFormProps>()(PropertyForm));