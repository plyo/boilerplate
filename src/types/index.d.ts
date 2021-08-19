export {
    ClientReques as IClientRequest,
    ServerResponse as IServerResponse
} from 'express';

export type dynamicFunction = (...args: any[]) => any;

export type fieldErrorsObject = {
    [name: string]: string[] | string;
}

export type errorsObject = {
    errors: {
        [name: string]: string[];
    }
}

export interface IError {
    message: string,
    name: string,
    statusCode: string | number,
    field: string,
    fields: fieldErrorsObject,
}

export interface ITimer {
    [name: string]: number;
}