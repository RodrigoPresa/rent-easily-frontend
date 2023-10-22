import { useContext } from "react";
import TranslateContext from "./TranslateContext";
import { WithTranslateOptions, TranslateFunction, translate, replaceValues, capitalize } from "./withTranslate";

export default function useTranslate(options: WithTranslateOptions = {}): TranslateFunction {
    const { resources } = useContext(TranslateContext);
    const { namespace } = options;
    return (translateKey, opt = {}, valuesToReplace) => {
        const { namespace: nSpace, capitalize: cap } = opt;
        const result = translate(resources, nSpace || namespace || 'general', translateKey);
        const replaced = replaceValues(result, valuesToReplace);
        return cap === true ? capitalize(replaced) : replaced;
    }
}