import User from "../model/User";
import Lock from "../utils/Lock";
import { ResponseError } from "./Errors";
import { getBaseUrl, promiseRequest } from "./ServiceApi";

let scopes: string[];

export function saveAuthToken({ accessToken, refreshToken, user }: AuthResponse) {
	return localStorage.setItem("authTokens", JSON.stringify({ accessToken, refreshToken, user }));
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

export interface Credentials {
	mail: string;
	password: string;
}

interface TokenResult {
	type: string;
	payload: string
}

interface Token {
	status: number;
	result: TokenResult[]
}

interface LoginRequest {
	credentials: Credentials;
}

class Claim {
	constructor(public key: string, public value: string) {
		this.key = key;
		this.value = value;
	}
}

class AuthRequest {
	constructor(public login: string, public roles: string[], public claims: Claim[]) {
		this.login = login;
		this.roles = roles;
		this.claims = claims;
	}
}

class SignUpRequest {
	constructor(public fullName: string, public cpf: string, public income: number,
		public registerType: string, public credentials: Credentials) {
		this.fullName = fullName;
		this.cpf = cpf;
		this.income = income;
		this.registerType = registerType;
		this.credentials = credentials;
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
	}

	getAccessToken() {
		var data = getAuthToken();
		return data !== null ? data.accessToken : null;
	}

	async getUser(response: any): Promise<User> {
		const { data } = await response.json();
		const [first] = data;
		return first as User;
	}

	async getToken(response: any): Promise<Token> {
		const data = await response.json();
		return data as Token;
	}

	async login(mail: string, password: string) {
		const credentials: Credentials = { mail, password };
		const request: LoginRequest = { credentials };
		var options = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(request)
		};
		
		var url = "http://localhost:8080/user/find/credentials";
		const response = await fetch(url, options);
		if (response.ok) {
			console.log(response);
			const user: User = await this.getUser(response);
			const result = await this.fetchAuthentication(user);
			if (result.ok) {
				const tkn: Token = await this.getToken(result);
				let accessToken = tkn.result[0].payload;
				let refreshToken = tkn.result[0].payload;
				saveAuthToken({ accessToken, refreshToken, user })
			}

			return user;
		}
		else {
			clearAuthToken();			
			const error: ResponseError = await response.json();
			throw new ResponseError(error.status, error.message, error.errors);
		}
	}

	async signUp(fullName: string, cpf: string, income: number,
		registerType: string, mail: string, password: string) {
		const credentials: Credentials = { mail, password };
		var request = new SignUpRequest(fullName, cpf, income, registerType, credentials);
		// var url = getBaseUrl('user') + 'create';
		var url = "http://localhost:8080/user/create"
		var options = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(request)
		};
		const response = await fetch(url, options);
		if (response.ok) {
			return true;
		}
		else {
			throw new Error("Unable to create user");
		}
	}

	async fetchAuthentication(user: User) {
		const claims: Claim[] = [];
		claims.push(new Claim("mail", user.credentials.mail));
		claims.push(new Claim("registerType", user.registerType));

		const roles: string[] = [];
		roles.push(user.registerType);

		const request = new AuthRequest(
			user.credentials.mail,
			roles,
			claims
		);
		var url = "http://localhost:8083/token/generate"
		var options = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(request)
		};

		return await fetch(url, options);
	}

	async logout() {
		clearAuthToken();
		//window.location.replace("/");
	}

	getAuthUser(): AuthResponse {
		var user = localStorage.getItem("authTokens");
		return typeof user === "string" ? JSON.parse(user) : null;
	}
}
