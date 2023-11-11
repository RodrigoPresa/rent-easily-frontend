import { WithSnackbarProps, withSnackbar } from "notistack";
import { WithTranslateProps, withTranslate } from "../../../components/Translate/withTranslate";
import Advertisement from "../../../model/Advertisement";
import React from "react";
import { ServiceApi } from "../../../services/ServiceApi";
import Form, { FormDirty, FormErrors, FormFooterAllButtons } from "../../../components/FormControl/Form/Form";
import Panel from "../../../components/Panel";
import PanelBodyFormContent from "../../../components/Panel/PanelBodyFormContent";
import { Box, Divider, Grid, TextField, Typography } from "@mui/material";
import { Trans } from "../../../components/Translate";
import SelectSearch from "../../../components/SelectSearch";
import Property from "../../../model/Property";
import User from "../../../model/User";
import OptionItem from "../../../components/SelectSearch/OptionItem";

export interface AdvertisementFormData {
    active: boolean;
    rentAmount: number;
    information: string;
    property: number;
}

export interface AdvertisementFormState {
    loadedModelList: boolean;
    isDirty: boolean;
    userProperties: Property[];
    userPropertyOptions: OptionItem<number>[];
}

export interface AdvertisementFormProps extends WithSnackbarProps, WithTranslateProps {
    authUser: User;
    advertisement: Advertisement | null;
    onSubmit: (data: AdvertisementFormData, isDirty: boolean) => any;
    onCancel: () => any;
    editing: boolean;
    isDisabled: boolean;
    alteringTab: (tab: number) => void;
    undoChanges: (() => void) | undefined;
    goToAdvertisementEditLink: (advertisement: Advertisement) => void;
    onChange?: (changed: boolean) => any;
}

class AdvertisementForm extends React.Component<AdvertisementFormProps, AdvertisementFormState> {

    private service: ServiceApi<Advertisement>;
    private propertyService: ServiceApi<Property>;

    constructor(props: AdvertisementFormProps) {
        super(props);
        this.state = {
            loadedModelList: false,
            isDirty: false,
            userProperties: [],
            userPropertyOptions: []
        }

        this.service = new ServiceApi<Advertisement>('advertisement');
        this.propertyService = new ServiceApi<Property>('property');

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.handleChangeAltering = this.handleChangeAltering.bind(this);
        this.setAlteringTab = this.setAlteringTab.bind(this);
        this.setFieldValueAltering = this.setFieldValueAltering.bind(this);
        this.setChanges = this.setChanges.bind(this);

        this.getProperties = this.getProperties.bind(this);
        this.getPropertyOption = this.getPropertyOption.bind(this);
    }

    async componentDidMount() {
        await this.reload();
    }

    async reload() {
        const userProperties = await this.getProperties();
        const userPropertyOptions = userProperties.map(this.getPropertyOption);

        this.setState({ userProperties, userPropertyOptions });
    }

    async onSubmitHandler(values: AdvertisementFormData, dirty: FormDirty<AdvertisementFormData>, errors?: FormErrors<AdvertisementFormData>) {
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

    getProperties(searchText?: string, page?: number, rowsPerPage?: number): Promise<Property[]> {
        const { authUser } = this.props;
        return this.propertyService.getList(`userId=${authUser.id}`).then(list => (list.data));
    }

    getPropertyOption(property: Property): OptionItem<number> {
        return {
            label: `${property.address.street}, ${property.address.streetNumber}`,
            value: property.id,
        };
    }

    handleChangeAltering(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, handleChange: any) {
        handleChange(event);
        this.setAlteringTab();
    }

    setAlteringTab() {
        const { alteringTab, editing } = this.props;
        if (!editing) {
            alteringTab(0);
        }
    }

    setFieldValueAltering(name: string, eventVal: any, setFieldValue: any) {
        const { alteringTab, editing } = this.props;
        setFieldValue(name, eventVal);
        if (!editing) {
            alteringTab(0);
        }
    }

    setChanges(changed: boolean) {
        const { onChange } = this.props;
        this.setState({ isDirty: changed });
        if (onChange)
            onChange(changed);
    }

    render() {

        const { advertisement, onCancel, editing, undoChanges, t, isDisabled, onChange } = this.props;
        const { isDirty, userProperties, userPropertyOptions } = this.state;

        const initialValues: AdvertisementFormData = {
            active: advertisement ? advertisement.active : false,
            rentAmount: advertisement ? advertisement.rentAmount : 0,
            information: advertisement ? advertisement.information : '',
            property: advertisement ? advertisement.propertyId : 0
        };

        return (
            <>
                <Panel
                    panelHeaderTitle={''}
                    panelFooterButtons={<FormFooterAllButtons blocked={isDisabled} onUndo={undoChanges} onBack={onCancel} isDirty={isDirty} />}
                >
                    <PanelBodyFormContent>
                        <Grid container direction="row" alignItems="center" spacing={1}>
                            <Grid item xs={12} sm={12} md={8} lg={8} >
                                <Form<AdvertisementFormData>
                                    initialValues={initialValues}
                                    onSubmit={this.onSubmitHandler}
                                    enableReinitialize={true}
                                    onChange={this.setChanges}
                                >
                                    {({ isSubmitting, values, errors, handleChange, setFieldValue, dirty }) => {
                                        return (
                                            <>
                                                <Grid container direction="row" alignItems="center" spacing={1}>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} >
                                                        <SelectSearch<Boolean>
                                                            name="active"
                                                            label={<Trans translateKey="activeLabel" capitalize namespace='device' />}
                                                            onChangeHandle={(name, value) => this.setFieldValueAltering('active', value, setFieldValue)}
                                                            options={[
                                                                { value: !values.active ?? 0, label: t('inactive', { capitalize: true }) },
                                                                { value: values.active ?? 1, label: t('active', { capitalize: true }) },
                                                            ]}
                                                            value={values.active}
                                                            error={!!errors.active && !!dirty.active}
                                                            helperText={!!errors.active && !!dirty.active && errors.active || ''}
                                                            margin='dense'
                                                            required
                                                            fullWidth
                                                            isDisabled={isDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                                        <SelectSearch<number>
                                                            name='property'
                                                            label={<Trans translateKey="property" capitalize />}
                                                            value={values.property === 0 ? null : values.property}
                                                            onChangeHandle={(_, v) => this.setFieldValueAltering("property", v, setFieldValue)}
                                                            options={userPropertyOptions}
                                                            margin='dense'
                                                            isDisabled={isDisabled}
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <TextField
                                                            name="rentAmount"
                                                            label={<Trans translateKey="rentAmount" capitalize />}
                                                            type="number"
                                                            margin="dense"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={values.rentAmount}
                                                            onChange={(e) => this.handleChangeAltering(e, handleChange)}
                                                            disabled={isDisabled}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <TextField
                                                            name="information"
                                                            label={<Trans translateKey="information" capitalize />}
                                                            margin="dense"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={values.information}
                                                            onChange={(e) => this.handleChangeAltering(e, handleChange)}
                                                            disabled={isDisabled}
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

export default withSnackbar(withTranslate<AdvertisementFormProps>()(AdvertisementForm));