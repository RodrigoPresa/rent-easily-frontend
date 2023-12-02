export interface ErrorMessage {
    message: string;
    stackTrace: string;
}

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

export class ResponseError {
    constructor(public status: number, public message: string, public errors: ErrorMessage[]) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}