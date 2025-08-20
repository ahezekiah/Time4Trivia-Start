class Result{
    constructor(status = '', message = '', data = null){
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

exports.Result = Result;