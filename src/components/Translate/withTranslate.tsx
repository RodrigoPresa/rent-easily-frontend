import * as React from "react";
import TranslateContext, { TranslateResources } from './TranslateContext';

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function translate(resources: TranslateResources, translateKey: string): string;
export function translate(resources: TranslateResources, namespace: string, translateKey?: string): string;

export function translate(resources: TranslateResources, namespace: string, translateKey?: string): string {
    if (!resources) return `[${translateKey}]`;
    const key = translateKey || namespace;
    const nSpace = translateKey ? namespace : "general";
    if (nSpace in resources && typeof resources[nSpace] === 'object') {
        const result = resources[nSpace][key];
        if (result) return result;
        console.warn('translate: translateKey not found:', { namespace: nSpace, key });
        return `[${key}]`;
    }
    console.warn('translate: namespace not found:', { namespace, key });
    return `[${key}]`;
}

export function replaceValues(str: string, values?: Record<string, string>): string {
    var result = String(str);
    if (values && typeof values === 'object') {
        const keys = Object.keys(values);
        keys.forEach((key) => {
            const value = values[key];
            result = result.replace('{{' + key + '}}', value);
        });
    }
    return result;
}

export interface WithTranslateOptions {
    namespace?: string;
}

export interface TranslateFunctionOptions extends WithTranslateOptions {
    capitalize?: boolean
}

export type TranslateFunction = (translateKey: string, options?: TranslateFunctionOptions, valuesToReplace?: Record<string, string>) => string;

export interface WithTranslateProps {
    t: TranslateFunction
}

type WrappedComponentProps<P> = Omit<P, keyof WithTranslateProps>;

export function withTranslate<P extends WithTranslateProps>({ namespace }: WithTranslateOptions = {}) {
    return (Component: React.ComponentType<P>): React.ComponentType<WrappedComponentProps<P>> => (props) => (
        <TranslateContext.Consumer>
            {({ resources }) => (
                <Component
                    {...props as P}
                    t={(translateKey: string, { namespace: nSpace, capitalize: cap }: TranslateFunctionOptions = {}, valuesToReplace?: Record<string, any>) => {
                        const result = translate(resources, nSpace || namespace || 'general', translateKey);
                        const replaced = replaceValues(result, valuesToReplace);
                        return cap === true ? capitalize(replaced) : replaced;
                    }}
                />
            )}
        </TranslateContext.Consumer>
    );
}