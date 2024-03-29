import * as type from '../types';
import config from 'config';
import logger from '../tools/logger';

/**
 * Usually goes with 400 status code
 * @typedef {object} APIValidationError
 * @property {object.<Array.<string>>} errors
 */

/**
 * @apiDefine ValidatedResponse
 * @apiError 400 Validation of one or more fields are not passed
 * @apiError 401 User is not authorized
 * @apiErrorExample {json} FieldsValidationError
 *    HTTP/1.1 400 Bad request
 *    {
 *      "errors": {
 *        "fieldName": [
 *          "fieldName is not valid"
 *        ]
 *      }
 *    }
 * @apiErrorExample {json} ValidationError
 *    HTTP/1.1 400 Bad request
 *    {
 *      "errors": {
 *        "": [
 *          "really bad request"
 *        ]
 *      }
 *    }
 */

export function formatValidationErrors(fields: type.fieldErrorsObject): type.errorsObject {
    const errors: type.errorsObject = {errors: {}};
    Object.keys(fields).forEach((fieldName) => {
        const fieldErrors = fields[fieldName];
        errors.errors[fieldName] = Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors];
    });
    return errors;
}

export function defaultHandler(res: type.IServerResponse, err: Error): void {
    logger.error(err);
    res.status(500).json({
        errors: {
            '': config.get('app.suppressErrorStack') ? [err.message] : [err.message, err.stack],
        },
    });
}

export function errorHandler(err: type.IError, req: type.IClientRequest, res: type.IServerResponse, next: () => {}): void {
    logger.debug(err.message, err);
    switch (err.name) {
        case 'FieldValidationError':
            res.status(+err.statusCode).json({
                errors: {
                    [err.field]: Array.isArray(err.message) ? err.message : [err.message],
                },
            });
            break;

        case 'FieldsValidationError':
            res.status(+err.statusCode).json(formatValidationErrors(err.fields));
            break;

        case 'HttpError':
            res.status(+err.statusCode).json({
                errors: {
                    '': Array.isArray(err.message) ? err.message : [err.message],
                },
            });
            break;

        default:
            defaultHandler(res, err);
    }
}
