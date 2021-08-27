const isReady = false;
// 1. Producer
const promise = new Promise((resolve, reject) => {
    console.log('Promise is created!'); // pending상태에서 찍음
    if (isReady) {
        resolve("It's ready"); // fulfilled상태, resove가 잘 되면 then으로 넘어감
    } else {
        reject('Not ready'); // rejected상태, catch로 빠짐
    }
});

// 2. Consumer
promise
    .then((messsage) => {
        // resolve(특정값) 이 특정값이 message로 넘어옴
        console.log(messsage);
    })
    .catch((error) => {
        // reject(특정값) 이 특정값이 error로 넘어옴
        console.error(error);
    })
    .finally(() => {
        // resolve인지 reject인지 상관 없이 반드시 실행
        console.log('Done');
    });

// Promise is created!
// It's ready
// Done
