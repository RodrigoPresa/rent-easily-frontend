import React from 'react';

import FileIcon from '@mui/icons-material/FileCopy';
import FolderIcon from '@mui/icons-material/Folder';
import EmailIcon from '@mui/icons-material/Email';
import OperatorsIcon from '@mui/icons-material/Group';
import OperationMapIcon from '@mui/icons-material/MapOutlined';
import UnityIcon from '@mui/icons-material/Domain';
import ReportIcon from '@mui/icons-material/PieChart';
import AreaIcon from '@mui/icons-material/WidgetsOutlined';
import ContactIcon from '@mui/icons-material/ContactPhone';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DomainIcon from '@mui/icons-material/Domain';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import LanguageIcon from '@mui/icons-material/Language';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import WorkIcon from '@mui/icons-material/Work';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PeopleIcon from '@mui/icons-material/People';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ChecklistIcon from '@mui/icons-material/Checklist';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons/faMobileAlt';
import { faServer, faVideo } from '@fortawesome/free-solid-svg-icons';

const style = {
    fontSize: '1rem',
    marginRight: 4
};

const fontawesomeStyle = {
    fontSize: 14,
    marginRight: 4,
    width: 16
}

class EnumTypeIcon extends React.Component {
    render() {
        const { type } = this.props;
        switch (type) {
            case 'OperatorGroups':
                return <FolderIcon style={{ ...style, fill: '#ecd31f' }} />
            case 'Operators':
                return <OperatorsIcon style={{ ...style, fill: '#4f45ea' }} />
            case 'Object':
                return <FontAwesomeIcon style={{ ...fontawesomeStyle }} icon={faBox} color="#4f45ea" />
            case 'Unity':
                return <UnityIcon style={style} />
            case 'UnityGroup':
                return <FolderIcon style={{ ...style, fill: '#ecd31f' }} />
            case 'Device':
                return <LanguageIcon style={{ ...style }} />
            case 'DeviceChild':
                return <FileIcon style={{ ...style, fill: '#f39858' }} />
            case 'Email':
                return <EmailIcon style={{ ...style }} />
            case 'EventGroup':
                return <FolderIcon style={{ ...style, fill: '#ecd31f' }} />
            case 'EventGroupChild':
                return <FileIcon style={{ ...style, fill: '#f35454' }} />
            case 'FloorPlan':
                return <DesignServicesIcon style={{ ...style }} />
            case 'TreatmentType':
                return <FolderIcon style={{ ...style, fill: '#ecd31f' }} />
            case 'TreatmentTypeChild':
                return <FileIcon style={{ ...style, fill: '#20b3b3' }} />
            case 'Video':
                return <FontAwesomeIcon style={{ ...fontawesomeStyle }} icon={faVideo} />
            case 'VideoServer':
                return <FontAwesomeIcon style={{ ...fontawesomeStyle }} icon={faServer} />
            case 'Area':
                return <AreaIcon style={{ ...style, fill: '#36c2f6' }} />
            case 'Account':
                return <MonetizationOnIcon style={{ ...style }} />
            case 'Local':
                return <DomainIcon style={{ ...style }} />
            case 'Vehicle':
                return <DriveEtaIcon style={{ ...style }} />
            case 'AccessControlPoint':
                return <MeetingRoomIcon style={{ ...style }} />
            case 'EventType':
                return <AreaIcon style={{ ...style, fill: '#f35454' }} />
            case 'SystemUser':
                return <KeyboardIcon style={{ ...style }} />
            case 'Mobile':
                return <FontAwesomeIcon style={{ ...fontawesomeStyle }} icon={faMobileAlt} />
            case 'Report':
                return <ReportIcon style={style} />
            case 'Setting':
                return <SettingsIcon style={{ ...style }} />
            case 'DeliveryActive':
                return <WorkIcon style={{ ...style, fill: '#9B02D6' }} />
            case 'ServiceProviderActive':
                return <WorkIcon style={{ ...style, fill: '#f39858' }} />
            case 'ServiceProviderAuthorized':
                return <WorkIcon style={{ ...style, fill: '#808080' }} />
            case 'VisitActive':
                return <EmojiPeopleIcon style={{ ...style, fill: '#4f45ea' }} />
            case 'VisitAuthorized':
                return <EmojiPeopleIcon style={{ ...style, fill: '#808080' }} />
            case 'FirmwareUpdate':
                return <SystemUpdateAltIcon style={{ ...style }} />
            case 'Tests':
                return <ChecklistIcon style={{ ...style }}/>
            case 'Folder':
                return <FolderIcon style={{ ...style, fill: '#ecd31f' }} />
            case 'People':
                return <PeopleIcon style={{ ...style, fill: '#36c2f6' }} />
            case 'Person1':
                return <PersonIcon style={{ ...style, fill: '#36c2f6' }} />
            case 'Person2':
                return <PersonIcon style={{ ...style, fill: '#20b3b3' }} />
            case 'Person3':
                return <PersonIcon style={{ ...style, fill: '#f39858' }} />
            case 'Person4':
                return <PersonIcon style={{ ...style, fill: '#4f45ea' }} />
            case 'Person5':
                return <PersonIcon style={{ ...style, fill: '#9B02D6' }} />
            default:
                return <FileIcon style={style} />;
        }
    }
}

export default EnumTypeIcon;