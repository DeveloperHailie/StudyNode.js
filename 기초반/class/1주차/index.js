// 실행 : node sp_mall\index.js
console.log('hello world!');

var age = 20;
console.log(age);

var name = 'Jone Doe';
console.log(name);

// 배열, 순서O
var parseArray = [10, 20, 30];
console.log(parseArray[0]);

// 객체, 순서X, key-value 방식
var personDict = { name1: name, name2: 'Jone Doe', age: 19 };
console.log(personDict['name1']);

if (personDict['age'] > 19) {
    console.log('Here is your beer!');
} else {
    console.log('Get out!!');
}

var personArray = [
    { name: 'John', age: 18 },
    { name: 'Hailie', age: 22 },
];

for (var i = 0; i < personArray.length; i++) {
    console.log(personArray[i]);
    if (isValidAge(personArray[i])) {
        console.log('ok');
    } else {
        console.log('bye');
    }
}

// 함수
// 여기 있어도 코드는 돌아가지만 위로 빼는게 좋은듯
function isValidAge(person) {
    if (person['age'] > 19) {
        return true;
    } else {
        return false;
    }
}
