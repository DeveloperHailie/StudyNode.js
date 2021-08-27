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
            if ('a' <= word && word <= 'z') {
                continue;
            }
            if ('A' <= word && word <= 'Z') {
                continue;
            }
            if ('0' <= word && word <= '9') {
                continue;
            }
            if (word === '+' || word === '-' || word === '_') {
                continue;
            }
            return false;
        }

        for (const word of domain) {
            if ('a' <= word && word <= 'z') {
                continue;
            }
            if ('A' <= word && word <= 'Z') {
                continue;
            }
            if ('0' <= word && word <= '9') {
                continue;
            }
            if (word === '.' || word === '-') {
                continue;
            }
            return false;
        }

        return true;
    },
};
