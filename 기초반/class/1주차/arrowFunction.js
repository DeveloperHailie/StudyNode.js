function hello() {
    console.log('Hello function');
}

// 첫번째 arrow function
// const 함수이름 = (인자) => {실행될 코드}
// 변수에 함수를 담는다 생각
// 함수이름()으로 호출
const arrowFunction = () => {
    console.log('Hello arrow function');
};

// 두번째 arrow function
// {} 코드 블럭 없음
// 실행 코드가 한 줄인 경우
const arrowFunctionWithoutReturn = () =>
    console.log('Hello arrow function without return');

hello(); // Hello function
arrowFunction(); // Hello arrow function
arrowFunctionWithoutReturn(); // Hello arrow function without return
