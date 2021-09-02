const app = require('../app');
const supertest = require("supertest");

test("/index.html 경로에 요청했을 때 status code가 200이어야 한다.", async () => { 
    const res = await supertest(app).get("/index.html");
    expect(res.status).toEqual(200);
});

test("/test.html 경로에 요청했을 때 status code가 404이어야 한다.", async () => { 
    const res = await supertest(app).get("/test.html");
    expect(res.status).toEqual(404);
});

/*
test("/api/goods/add/crawling 경로에 요청했을 때 status code가 200이어야 한다.", async () => { 
    const res = await supertest(app).get("/api/goods/add/crawling");
    expect(res.status).toEqual(200);
});
*/

test("/ 경로에 요청했을 때 status code가 200이어야 한다.", async () => { 
    const res = await supertest(app).get("/");
    expect(res.status).toEqual(200);
});

