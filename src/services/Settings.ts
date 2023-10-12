const API_PROTOCOL = window.location.protocol.includes('https') ? 'https' : 'http';
const API_HOST = window.location.hostname;
const API_PORT = parseInt(window.location.port || (window.location.protocol.includes('https') ? '443' : '80'));
const API_PATH = "";

let _instance: Settings | null = null;

export interface SettingsInterface {
	apiProtocol?: string;
	apiHost?: string;
	apiPort?: number;
	apiPath?: string;
}

export default class Settings implements SettingsInterface {

	public apiProtocol: string;
	public apiHost: string;
	public apiPort: number;
	public apiPath: string;

	protected constructor(props: SettingsInterface) {
		const { apiProtocol, apiHost, apiPort, apiPath } = props;
		this.apiProtocol = apiProtocol ? apiProtocol : API_PROTOCOL;
		this.apiHost = apiHost ? apiHost : API_HOST;
		this.apiPort = apiPort ? apiPort : API_PORT;
		this.apiPath = typeof apiPath === "string" ? apiPath : API_PATH;
	}

	static get(): SettingsInterface {
		if (_instance === null) {
			var defaultSettings = {
				apiProtocol: API_PROTOCOL,
				apiHost: API_HOST,
				apiPort: API_PORT,
				apiPath: API_PATH
			};
			return new Settings(defaultSettings);
		} else {
			return _instance;
		}
	}

	static set(settings: SettingsInterface) {
		_instance = new Settings(settings);
	}
}
