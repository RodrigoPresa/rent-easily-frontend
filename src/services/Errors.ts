export class UnauthorizedError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export class PermissionError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export class ServerError extends Error {
    constructor(message?: string) {
        super(message);
    }
}