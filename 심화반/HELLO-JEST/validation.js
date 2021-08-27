module.exports = {
    isEmail: (value) => {
        let emailValidation = true;
        let hasAtSign = false;

        if (value[0]=="-") // 맨 앞글자 - 체크
            emailValidation = false;
        for(let char of value){
            if(!emailValidation){
                continue;
            }
            if(char == " "){ // 공백 존재 체크
                emailValidation = false;
            }
            if(char == "@") { // @ 체크
                if(hasAtSign){ // @가 이미 존재하는 경우
                    emailValidation = false;
                }
                else{
                    hasAtSign = true;
                }
            }
        }
        if(!hasAtSign){ // @ 1개도 없는 경우
            emailValidation = false;
        }
            
        return emailValidation;
    },
};