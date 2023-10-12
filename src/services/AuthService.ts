import User from "../model/User";
import Lock from "../utils/Lock";
import { PermissionError } from "./Errors";
import { getBaseUrl, promiseRequest } from "./ServiceApi";

let scopes: string[];

export type AuthType = 'local' | 'AzureAd';

export function saveAuthToken({ accessToken, refreshToken }: AuthResponse) {
	return localStorage.setItem("authTokens", JSON.stringify({ accessToken, refreshToken }));
};

function clearAuthToken() {
	return localStorage.removeItem("authTokens");
};

export function getAuthToken(): AuthResponse {
	var token = localStorage.getItem("authTokens");
	return typeof token === "string" ? JSON.parse(token) : null;
};

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user?: User;
}

class LoginRequest {
	constructor(public login: string, public senha: string) {
		this.login = login;
		this.senha = senha;
	}
}

class RefreshRequest {
	constructor(public refreshToken: string) {
		this.refreshToken = refreshToken;
	}
}

let _instance: AuthService;

export default class AuthService {

	static get instance() {
		if (_instance == null) {
			_instance = new AuthService();
		}
		return _instance;
	}

	private lock: Lock;

	constructor() {
		this.lock = new Lock();
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.getAccessToken = this.getAccessToken.bind(this);
		this.getRefreshToken = this.getRefreshToken.bind(this);
	}

	getAccessToken() {
		var data = getAuthToken();
		return data !== null ? data.accessToken : null;
	}

	getRefreshToken() {
		var data = getAuthToken();
		return data !== null ? data.refreshToken : null;
	}

	async refreshToken() {
		await this.lock.acquire();
		var refresh_token = this.getRefreshToken();
		if (!refresh_token) {
			this.lock.release();
			return Promise.resolve(null);
		}
		var url = getBaseUrl('auth') + 'refreshToken/';
		var request = new RefreshRequest(refresh_token);
		var options = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(request)
		};
		var token: AuthResponse | null;
		const response = await fetch(url, options);
		if (response.ok) {
			token = await response.json();
			if (token) {
				saveAuthToken(token);
			}
		} else {
			clearAuthToken();
			console.error("Invalid Refresh Token");
			token = null;
		}
		this.lock.release();
		return token;
	}

	async login(email: string, password: string) {
		var request = new LoginRequest(email, password);
		var options = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(request)
		};
		var token: AuthResponse;
		var url = getBaseUrl('auth') + 'login/';
		const response = await fetch(url, options);
		if (response.ok) {
			token = await response.json();
			saveAuthToken(token);
			var user = token.user;

            // TODO: Pensar em como será feito o controle de permissões
			// if (user) {
			// 	scopes = await AuthService.instance.getAuthUserPermissions(user.id)
			// 	user.scopes = scopes;
			// }

			return user;
		}
		else {
			clearAuthToken();
			if (response.status === 403) {
				throw new PermissionError();
			}

			throw new Error("Invalid login");
		}
	}

	async authenticate(access_token: string) {
		var url = getBaseUrl('auth') + `authenticate?access_token=${access_token}`;
		var options = {
			method: "POST"
		};
		var token: AuthResponse;
		const response = await fetch(url, options);
		if (response.ok) {
			token = await response.json();
			saveAuthToken(token);

			return token.user;
		}
		else {
			clearAuthToken();
			throw new Error("Invalid login");
		}
	}

	async logout() {
		clearAuthToken();
	}

	getAuthUser(): Promise<User> {
		var url = getBaseUrl('auth') + 'user';
		return promiseRequest(url);
	}

	// getAuthUserPermissions(id: string | number): Promise<string[]> {
	// 	var baseUrl = getBaseUrl('auth');
	// 	var url = `${baseUrl}${id}/userPermissions`
	// 	return promiseRequest(url);
	// }
}
