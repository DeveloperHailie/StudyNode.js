const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 미들웨어는 req, res, next 라는 인자값을 가짐
module.exports = (req, res, next) => {
    /*
    헤더에 Authorization라는 이름의 키에다가 
    "토큰타입 토큰" 나열하면, 
    어떤 토큰 타입의 토큰이구나 하고 알 수 있게 약속
    */
    const { authorization } = req.headers;
    // console.log(authorization);
    /* 출력값
    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGZmZjU1NmM4NGY0NzMyNTA4YTg1YTUiLCJpYXQiOjE2MjczODg3MzZ9.JVv10IP8PdhQGE4kfwmPI6MsXLZ4I2NxRle6VMFq2ZM
    */

    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return; //next가 호출이 안되게
    }

    try {
        const { userId } = jwt.verify(tokenValue, 'my-secret-key');

        // async 함수 아니므로 await 사용 불가
        User.findById(userId)
            .exec()
            .then((user) => {
                if (!user) {
                    res.status(401).send({
                        errorMessage: '로그인 후 사용하세요',
                    });
                    return;
                }

                // 이 미들웨어를 사용하는 라우터에서 굳이 db에서 사용자 정보 가져오지 않게 할 수 있도록
                // express가 제공하는 안전한 변수에 담아주고 언제나 꺼내서 사용할 수 있게 작성
                // 정상적으로 응답 값 보내고 나면 소멸하므로 해당 데이터가 어딘가에 남아있을 걱정할 필요 없다.
                res.locals.user = user;

                // 미들웨어는 next가 반드시 호출되어야 한다.
                // 만약 next가 호출이 안된다 => 미들웨어 레벨에서 예외 처리에 걸림
                // next 없으면 그 뒤에 있는 미들웨어까지 연결이 안되는 형식이므로 주의
                next();
            });
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }
};
