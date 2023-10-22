import React from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { pt } from 'yup-locale-pt';

import TranslateContext, { TranslateResources } from './TranslateContext';

interface TranslateProviderProps {
    language: string
}

interface TranslateProviderState {
    resources: TranslateResources
}

class TranslateProvider extends React.Component<TranslateProviderProps, TranslateProviderState> {

    constructor(props: TranslateProviderProps) {
        super(props);
        this.state = {
            resources: {}
        }
    }

    async getResource() {
        const { language } = this.props;
        var fileName = 'pt-br';
        if (language.startsWith('en')) {
            fileName = 'en';
        } else if (language.startsWith('es')) {
            fileName = 'es';
        }
        const response = await fetch(`locales/${fileName}.json?q=${Date.now()}`);
        const resources = await response.json();
        this.setState({ resources }, () => {
            this.setValidationMessages();
        });
    }

    setValidationMessages() {
        Yup.setLocale(pt);
    }

    componentDidMount() {
        this.getResource();
    }

    componentDidUpdate(prevProps: TranslateProviderProps) {
        if (prevProps.language !== this.props.language) {
            this.getResource();
        }
    }

    render() {
        const { children, language } = this.props;
        const { resources } = this.state;
        return (
            <TranslateContext.Provider value={{ language, resources }}>
                {children}
            </TranslateContext.Provider>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        language: state.language
    };
}

export default connect(mapStateToProps, {})(TranslateProvider);