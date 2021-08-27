async function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('완료!'), 1000);
    });
    // 원래였으면 promise.then()해서 실행 및 처리했을 텐데
    // promise.thn()했으면 promise는 비동기로 처리되고 그 밑에 코드 그냥 실행되었겠지

    console.log('before await!');
    let result = await promise;
    // 해당 promise 실행되어서 응답 올 때까지 기다림
    // 즉, 프라미스가 이행될 때까지 기다림 (*)
    console.log('after await!');

    console.log(result); // "완료!"
}

f();

/*
before await!
after await!
완료!
*/
