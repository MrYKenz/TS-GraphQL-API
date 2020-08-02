export const validateRegister = (
    email: string,
    password: string
    ) => {
    const errors: Array<string> = ['Errors:'];
    function isValidEmail(testEmail: string) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(testEmail.toLowerCase());
    }
    if (!isValidEmail(email)) {
        errors.push('Invalid email address')
    }
    function containsSpecial(testPassword: string) {
        const specialChars = " !\"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~";
        for (let i=0; i < testPassword.length; i++) {
            if (specialChars.includes(testPassword[i])) {
                return true;
            }
        }
        return false;
    }
    function containsNumber(testPassword: string) {
        const numbers = "0123456789";
        for (let i=0; i < testPassword.length; i++) {
            if (numbers.includes(testPassword[i])) {
                return true;
            }
        }
        return false;
    }
    if (password.length < 8) {
        errors.push('Password must be 8 characters or longer');
    } else if (!containsNumber(password)) {
        errors.push('Password does not contain any numbers');
    } else if (!containsSpecial(password)) {
        errors.push('Password does not contain any special characters');
    }
    return errors.join(' ');
};

export const validateLogin = (
    email: string, 
    password: string
    ) => {
    const errors: Array<string> = ['Errors:'];
    if (email.length < 1) {
        errors.push('Username can not be empty');
    }
    if (password.length < 1) {
        errors.push('Password can not be empty');
    }
    return errors.join(' ');
}