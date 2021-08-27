module.exports = {
    isEmail: (value) => {
        if(value.split('@').length !== 2){ // aa@bb이면 aa,bb 겠지
            return false;
        }
        if(value.includes(' ')){
            return false;
        }
        if(value[0]==='-'){
            return false;
        }
            
        return true;
    },
};