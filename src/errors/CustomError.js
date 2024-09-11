import { Tipos_Error } from "./Errors.js";

export class CustomError{
    static createError(name = "Error", cause, message, code=Tipos_Error.Internal_Server_Error){
        const error = new Error(message, {cause:cause});
        error.name = name;
        error.code = code;

        throw error;
    }

}