class ApiResponse{
    constructor(
        message,
        data,
        statusCode,
        success
    ){
        this.message = message;
        this.data = data;
        this.statuscode = statuscode;
        this.success = statuscode < 400;
    }  
};

export default ApiResponse;