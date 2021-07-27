const jwt = require("jsonwebtoken");

const token = jwt.sign( {test: true}, 'my-secret-key');
console.log(token);

//decode는 데이터만 까서 보는 형태
//verify는 유효한 데이터인지까지 확인
const decoded = jwt.verify(token, 'my-secret-key');
//const decoded2 = jwt.verify(token+'aa', 'my-secret-key'); // 에러
console.log(decoded);
//console.log(decoded2); // 에러

const decoded_content = jwt.decode(token);
const decoded_content2 = jwt.decode(token+'aa');
console.log(decoded_content); // { test: true, iat: 1627383613 }
console.log(decoded_content2); // { test: true, iat: 1627383613 }