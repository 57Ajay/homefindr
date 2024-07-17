class ApiError extends Error{
    constructor(
        message = "something went wrong",
        statuscode,
        errors = [],
        stack = ""
    ){
        super(message);
        this.statuscode = statuscode;
        this.errors = errors;
        this.data = null;
        this.message = message;
        this.success = false;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
};

export default ApiError;