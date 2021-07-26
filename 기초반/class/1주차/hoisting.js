if(true){
    var test = "true";
}
console.log(test); // true 출력

if(true){
    let test2 = "true";
}
//console.log(test2); // ReferenceError: test3 is not defined

test2 = "gg";
console.log(test2); // undefined 출력
var test2 = "test2";
console.log(test2); // test2 출력

test3 = "test3_before";
console.log(test3); // test3_before 출력
var test3 = "test3_after";
console.log(test3); // test3_after 출력

foo(); // 함수 실행, hello 출력
// foo2(); // TypeError : foo2 is not a function

function foo() { // 함수선언문
    console.log("hello");
}
var foo2 = function () { // 변수 선언 및 할당
    console.log("hello2");
}

foo2(); // hello2 출력

// console.log(test4); //ReferenceError: Cannot access 'test3' before initialization
let test4 = "test4"; 