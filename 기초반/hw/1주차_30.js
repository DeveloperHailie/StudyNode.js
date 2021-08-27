var personArray = [
    { name: 'John Doe', age: 20 },
    { name: 'Jane Doe', age: 19 },
];

for (let person of personArray) {
    console.log(
        'His/her name is ' +
            person['name'] +
            '. He/She is ' +
            person['age'] +
            ' years old.'
    );
}
