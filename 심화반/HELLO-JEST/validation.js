module.exports = {
    isEmail: (value) => {
        const [localPart, domain, ...etc] = value.split('@');

        if (!localPart || !domain || etc.length) {
            return false;
        }
        if (value.includes(' ')) {
            return false;
        }
        if (value[0] === '-') {
            return false;
        }

        for (const word of localPart) {
            if (!/^[0-9a-z+_-]+$/gi.test(word)){
                return false;
            }
        }

        for (const word of domain) {
            const allowedSpecialWords = ['.','-'];
            if(allowedSpecialWords.includes(word)){
                continue;
            }

            if ('a' <= word && word <= 'z') {
                continue;
            }
            if ('A' <= word && word <= 'Z') {
                continue;
            }
            if ('0' <= word && word <= '9') {
                continue;
            }
           
            return false;
        }

        return true;
    },
};
