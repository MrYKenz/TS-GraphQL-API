export const validateRegister = (
    email: string,
    password: string
    ) => {
    const errors: Array<string> = [];
    function isValidEmail(testEmail: string) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(testEmail.toLowerCase());
    }
    function containsSpecial(testPassword: string) {
        const specialChars = "!\"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~";
        for (let i=0; i < testPassword.length; i++) {
            if (specialChars.includes(testPassword[i])) return true;
        }
        return false;
    }
    function containsNumber(testPassword: string) {
        const numbers = "0123456789";
        for (let i=0; i < testPassword.length; i++) {
            if (numbers.includes(testPassword[i])) return true;
        }
        return false;
    }
    function containsLowerCase(testPassword: string) {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        for (let i=0; i < testPassword.length; i++) {
            if (lowercase.includes(testPassword[i])) return true;
        }
        return false;
    }
    function containsUpperCase(testPassword: string) {
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i=0; i < testPassword.length; i++) {
            if (uppercase.includes(testPassword[i])) return true;
        }
        return false;
    }

    if (!isValidEmail(email)) errors.push('Invalid email address');
    if (password.length < 8) errors.push('Password must be 8 characters or longer');
    if (!containsNumber(password)) errors.push('Password does not contain any numbers');
    if (!containsSpecial(password)) errors.push('Password does not contain any special characters');
    if (!containsLowerCase(password)) errors.push('Password must contain at least one lowercase letter');
    if (!containsUpperCase(password)) errors.push('Password must contain at least one uppercase letter');

    if (errors.length > 0) return errors.join('\n');
    else return false;
};

export const validateLogin = (
    email: string, 
    password: string
    ) => {
    const errors: Array<string> = [];
    if (email.length < 1) {
        errors.push('Username can not be empty');
    }
    if (password.length < 1) {
        errors.push('Password can not be empty');
    }

    if (errors.length > 0) return errors.join('\n');
    else return false;
}