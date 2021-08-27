const { isEmail } = require('./validation');

test('입력한 이메일 주소에는 "@" 문자가 1개만 있어야 이메일 형식이다.', ()=>{
    expect(isEmail('my-email@domain.com')).toEqual(true);
    expect(isEmail('my-emaildomain.com')).toEqual(false);
    expect(isEmail('my-email@@domain.com')).toEqual(false);
});

test('입력한 이메일 주소에 공백(스페이스)이 존재하면 이메일 형식이 아니다.', ()=>{
    expect(isEmail('myemail@domain.com')).toEqual(true);
    expect(isEmail('my email@domain.com')).toEqual(false);
});

test('입력한 이메일 주소 맨 앞에 하이픈(-)이 있으면 이메일 형식이 아니다.', ()=>{
    expect(isEmail('my-email@domain.com')).toEqual(true);
    expect(isEmail('-my-email@domain.com')).toEqual(false);
});

test('입력한 이메일 주소중, 로컬 파트(골뱅이 기준 앞부분)에는 영문 대소문자와 숫자, 특수문자는 덧셈기호(+), 하이픈(-), 언더바(_) 3개 외에 다른 값이 존재하면 이메일 형식이 아니다.', ()=>{
    expect(isEmail('my+email@domain.com')).toEqual(true);
    expect(isEmail('my_email@domain.com')).toEqual(true);
    expect(isEmail('my+-+email@domain.com')).toEqual(true);
    expect(isEmail('myemail010@domain.com')).toEqual(true);
    expect(isEmail('myEmail@domain.com')).toEqual(true);
    expect(isEmail('myemail@domain.com')).toEqual(true);
    expect(isEmail('ㅎㅎail@domain.com')).toEqual(false);
    expect(isEmail('my!email@domain.com')).toEqual(false);
});

test('입력한 이메일 주소중, 도메인(골뱅이 기준 뒷부분)에는 영문 대소문자와 숫자, 점(.), 하이픈(-) 외에 다른 값이 존재하면 이메일 형식이 아니다.', ()=>{
    expect(isEmail('my-email@doma1in.com')).toEqual(true);
    expect(isEmail('my-email@dom-ain.com')).toEqual(true);
    expect(isEmail('my-email@domAin.com')).toEqual(true);
    expect(isEmail('my-email@domain.com')).toEqual(true);
    expect(isEmail('my-email@do.ma1in.com')).toEqual(true);
    expect(isEmail('my-email@Dom-a1in.com')).toEqual(true);
    expect(isEmail('my-email@domainㅎ.com')).toEqual(false);
    expect(isEmail('my-email@domain!.com')).toEqual(false);
});
