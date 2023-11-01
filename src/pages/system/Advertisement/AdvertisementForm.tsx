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


export interface AdvertisementFormData {
    active: boolean;
    rentAmount: number;
    information: string;
    propertyId: number;
}

export interface AdvertisementFormState {
    loadedModelList: boolean;
    isDirty: boolean;
}

export interface AdvertisementFormProps extends WithSnackbarProps, WithTranslateProps {
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

    constructor(props: AdvertisementFormProps) {
        super(props);
        this.state = {
            loadedModelList: false,
            isDirty: false
        }

        this.service = new ServiceApi<Advertisement>('advertisement');

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.handleChangeAltering = this.handleChangeAltering.bind(this);

        this.setAlteringTab = this.setAlteringTab.bind(this);

        this.setFieldValueAltering = this.setFieldValueAltering.bind(this);
        this.setChanges = this.setChanges.bind(this);
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
        const { isDirty } = this.state;

        const initialValues: AdvertisementFormData = {
            active: advertisement ? advertisement.active : false,
            rentAmount: advertisement ? advertisement.rentAmount : 0,
            information: advertisement ? advertisement.information : '',
            propertyId: advertisement ? advertisement.propertyId : 0
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
                                                    <Grid item xs={12} sm={12} md={10} lg={10} >
                                                        <Box marginBottom={1}>
                                                            <Typography variant='subtitle2'>
                                                                <Trans translateKey='main' namespace='device' capitalize></Trans>
                                                            </Typography>
                                                        </Box>
                                                        
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