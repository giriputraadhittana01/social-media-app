const validateRegisterInput = (username,password,confirmPassword,email) => {
    const errors = {}
    // Check username
    if(username.trim() == ''){
        errors.username = 'Username must not be empty';
    }
    
    // Check email
    if(email.trim() == ''){
        errors.email = 'Email must not be empty';
    }else{
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email.match(re)){
            errors.email = 'Email must be a valid email address';
        }
    }

    // Check password
    if(password == ''){
        errors.password = 'Password must not be empty';
    }else if(password != confirmPassword){
        errors.confirmPassword = 'Password must match';
    }

    return {
        errors,
        valid : Object.keys(errors).length < 1
    }
}

const validateLoginInput = (username, password) => {
    const errors = {};
    if(username.trim() == ''){
        errors.username = 'Username must not be empty';
    }
    if(password.trim() == ''){
        errors.password = 'Password must not be empty';
    }

    return {
        errors,
        valid : Object.keys(errors).length < 1
    }
}

module.exports = {validateRegisterInput,validateLoginInput}