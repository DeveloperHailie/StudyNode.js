function getAgeAverage(personArray) {
    var average = 0;
    var sum = 0;
    for (var i = 0; i < personArray.length; i++) {
        var person = personArray[i];
        sum += person['age'];
    }

    average = sum / personArray.length;
    return average;
}

// 자동들여쓰기 : ctrl + K + F
var personArray = [
    { name: 'John Doe', age: 20 },
    { name: 'Jane Doe', age: 19 },
    { name: 'Fred Doe', age: 32 },
    { name: 'Chris Doe', age: 45 },
    { name: 'Layla Doe', age: 37 },
];

console.log(getAgeAverage(personArray)); // 30.6
