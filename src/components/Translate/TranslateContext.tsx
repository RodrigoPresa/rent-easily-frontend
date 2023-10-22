import React from 'react';

export interface TranslateResource {
    [key: string]: string
}

export interface TranslateResources {
    [namespace: string]: TranslateResource
}

interface TranslateContextData {
    resources: TranslateResources,
    language: string
}

export default React.createContext<TranslateContextData>({
    resources: {},
    language: 'pt-br'
});