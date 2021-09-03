let authMiddleware = require('../middlewares/auth-middleware');
jest.mock("../models");

const { User } = require("../models");

test("정상적인 토큰을 넣은 경우 User.findByPk가 실행된다.", () => {
    User.findByPk = jest.fn();

    authMiddleware({
        headers: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5LCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.27uuQ34QFqdzibQrQSJ0OKyI4wqIXz6wVvJ1uSlcESQ",
        },
    }, {
        status: () => ({
            send: () => {},
        }),
        locals: {},
    });

    expect(User.findByPk).toHaveBeenCalledTimes(1);
    expect(User.findByPk).toHaveBeenCalledWith(99);
});

test("변조된 토큰으로 요청한 경우 로그인 후 사용하세요 라는 에러 메세지가 뜬다.", () => {
    const mockedSend = jest.fn();

    authMiddleware({
        headers: {
            authorization: "Bearer ",
        },
    }, {
        status: () => ({
            send: mockedSend,
        }),
        locals: {},
    });

    expect(mockedSend).toHaveBeenCalledWith({
        errorMessage: "로그인 후 사용하세요",
    });
});