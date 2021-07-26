const students = ["H","A","B"];

for(let i=0;i<students.length;i++){
    console.log(students[i]);
}

// 배열의 원소를 하나씩 student에 넣어보자.
for(let student of students){ 
    console.log(student);
}

// 배열의 인덱스를 차례대로 index에 넣어보자.
for(let index in students){ 
    console.log(index);
}

// 배열의 내장 함수 = forEach()
// ()안에 콜백함수 선언
// 배열 원소를 하나씩 student에 넣어줌
// 콜백함수 선언 법 ()=>{}
students.forEach((student)=>{
    console.log(student);
});