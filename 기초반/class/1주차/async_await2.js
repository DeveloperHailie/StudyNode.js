function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('완료!'), 1000);
    });
    console.log('before promise.then!');
    let outResult;
    promise.then((result) => {
        console.log(result);
        outResult = result;
    });
    console.log('after promise.then!');

    console.log(outResult); // "완료!"
}

f();

/*
before promise.then!
after promise.then!
undefined
완료!
*/
