import React from 'react';

interface PanelProps {
    panelHeaderTitle?: React.ReactNode;
    panelHeaderMiddle?: any;
    panelHeaderButtons?: any;
    panelHeaderTabs?: any;
    panelFooterButtons?: any;
    style?: React.CSSProperties;
    componentPanelBodyStyle?: React.CSSProperties;
    elevation?: Number;
}

class Panel extends React.Component<PanelProps>{ }

export default Panel;