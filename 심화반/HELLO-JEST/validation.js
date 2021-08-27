module.exports = {
    isEmail: (value) => {
        const email = value || '';
        const [localPart, domain, ...etc] = email.split('@');

        if (!localPart || !domain || etc.length) {
            return false;
        } else if (email.includes(' ')) {
            return false;
        } else if (email[0] === '-') {
            return false;
        } else if (!/^[a-z0-9+_-]+$/gi.test(localPart)) {
            return false;
        } else if (!/^[a-z0-9.-]+$/gi.test(domain)) {
            return false;
        }

        return true;
    },
};
