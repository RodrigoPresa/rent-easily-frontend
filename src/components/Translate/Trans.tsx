import * as React from 'react';
import { withTranslate, WithTranslateProps } from './withTranslate';

export interface TransProps extends WithTranslateProps {
    namespace?: string;
    translateKey: string;
    capitalize?: boolean;
    valuesToReplace?: Record<string, string>;
}

class Trans extends React.Component<TransProps> {
    render() {
        const { children, translateKey, namespace, capitalize, t, valuesToReplace } = this.props;
        const result = t(translateKey, { namespace, capitalize }, valuesToReplace);
        return !result.includes(`[${translateKey}]`) ? result : (children || result);
    }
}

export default withTranslate<TransProps>()(Trans);