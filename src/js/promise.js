// Change value of isSuccess variable to call resolve or reject
const isSuccess = false;
console.log("isSuccess:::", isSuccess);

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (isSuccess) {
      resolve("Success! Value passed to resolve function");
    } else {
      reject("Error! Error passed to reject function");
    }
  }, 2000);
});
console.log("promise >> promise:::", promise);

// Will run first
console.log("Before promise.then()");

// & Theoretically use
// Registering promise callbacks
promise.then(
  // onResolve will run third or not at all
  value => {
    console.log("Theoretically - 'then' onResolve call inside promise.then()");
    console.log(value); // "Success! Value passed to resolve function"
  },
  // onReject will run third or not at all
  error => {
    console.log("Theoretically - 'then' onReject call inside promise.then()");
    console.log(error); // "Error! Error passed to reject function"
  },
);

// Will run second
console.log("After promise.then()");

// & Practically use
promise
  .then(value => {
    console.log("practice - 'then' when resolved");
    console.log(value);
  })
  .catch(error => {
    console.log("practice - 'catch' when rejected");
    console.log(error);
  });

// & Метод finally() може бути корисним, якщо необхідно виконати код після того, як обіцянка буде дозволена (fulfilled або rejected), незалежно від результату. Дозволяє уникнути дублювання коду в обробниках then() і catch().
promise
  .then(value => console.log(value)) // "Success! Value passed to resolve function"
  .catch(error => console.log(error)) // "Error! Error passed to reject function"
  .finally(() => console.log("finally - Promise settled")); // "Promise settled"

// & Метод then() результатом свого виконання повертає ще один проміс, значенням якого буде те, що поверне його callback-функція onResolve. Це дозволяє будувати асинхронні ланцюжки з промісів.

const promise02 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(5);
  }, 2000);
});

promise02
  .then(value => {
    console.log(value); // 5
    return value * 2;
  })
  .then(value => {
    console.log(value); // 10
    return value * 3;
  })
  .then(value => {
    console.log(value); // 30
  })
  .catch(error => {
    console.log(error);
  })
  .finally(() => {
    console.log("Final task");
  });

// & Промісифікація функцій
const fetchUserFromServer = (username, onSuccess, onError) => {
  console.log(`Fetching data for ${username}`);

  setTimeout(() => {
    // Change value of isSuccess variable to simulate request status
    const isSuccess = true;

    if (isSuccess) {
      onSuccess("success value");
    } else {
      onError("error");
    }
  }, 2000);
};

const onFetchSuccess = user => {
  console.log(user);
};

const onFetchError = error => {
  console.error(error);
};

fetchUserFromServer("Mango", onFetchSuccess, onFetchError);

// Промісифікована функція:
const fetchUserFromServer02 = username => {
  return new Promise((resolve, reject) => {
    console.log(`Fetching data for ${username}`);

    setTimeout(() => {
      // Change value of isSuccess variable to simulate request status
      const isSuccess = true;

      if (isSuccess) {
        resolve("success value");
      } else {
        reject("error");
      }
    }, 2000);
  });
};

fetchUserFromServer02("Mango")
  .then(user => console.log(user))
  .catch(error => console.error(error));

// * Promise.all() - Приймає масив промісів, очікує їх виконання і повертає проміс. Якщо всі проміси виконаються успішно, проміс, що повертається, перейде у стан fulfilled, а його значенням буде масив результатів виконання кожного промісу. У разі, коли хоча б один з промісів буде відхилений, проміс, що повертається, перейде у стан rejected, а його значенням буде помилка.
const makePromise = (text, delay) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(text), delay);
  });
};

const promiseA = makePromise("promiseA value", 1000);
const promiseB = makePromise("promiseB value", 3000);

// Колбек методу then() буде викликаний через три секунди, тобто коли виконається проміс promiseB. Проміс promiseA виконається через одну секунду і просто чекатиме. Якщо будь-який з промісів буде відхилений, то буде викликаний колбек методу catch().
Promise.all([promiseA, promiseB])
  .then(value => console.log(value)) //["promiseA value", "promiseB value"]
  .catch(error => console.log(error));

// * Promise.race() - Повертає виконаний або відхилений проміс, залежно від того, з яким результатом завершиться «найшвидший» з переданих промісів, зі значенням або причиною його відхилення.
// Коли хоча б один проміс з масиву виконається або буде відхилений, проміс, що повертається, перейде у стан resolved або rejected, а всі інші будуть відкинуті.
// Колбек методу then() або catch() буде викликаний через одну секунду, коли виконається promiseA. Другий проміс promiseB буде проігнорований.
Promise.race([promiseA, promiseB])
  .then(value => console.log(value)) // "promiseA value"
  .catch(error => console.log(error));

// * Promise.resolve() і Promise.reject() - Статичні методи для створення промісів, що миттєво успішно виконуються або відхиляються. Працюють аналогічно new Promise() за винятком можливості вказати затримку, але мають коротший синтаксис.
// Ці методи використовуються для промісифікаціі функцій, коли необхідно побудувати ланцюжок промісів і вже є початкове значення.

// Виконаємо рефакторинг наступного коду.
// ===========
// Синхронна функція
const makeGreeting = guestName => {
  if (guestName === "" || guestName === undefined) {
    return {
      success: false,
      message: "Guest name must not be empty",
    };
  }

  return {
    success: true,
    message: `Welcome ${guestName}`,
  };
};

const result = makeGreeting("Mango");

if (result.success) {
  console.log(result.message);
} else {
  console.error(result.message);
}
// ============
// Проміжний результат - колбеки звільняють від необхідності повертати складні об'єкти зі статусом операції і перевіряти його у зовнішньому коді
const makeGreeting_ = (guestName, onSuccess, onError) => {
  if (guestName === "" || guestName === undefined) {
    return onError("Guest name must not be empty");
  }
  onSuccess(`Welcome ${guestName}`);
};

makeGreeting_(
  "Mango",
  greeting => console.log(greeting),
  error => console.error(error),
);

// ============
// Промісифікована функція
const makeGreeting_02 = guestName => {
  if (guestName === "" || guestName === undefined) {
    return Promise.reject("Guest name must not be empty");
  }

  Promise.resolve(`Welcome ${guestName}`);
};

makeGreeting_02("Mango")
  .then(greeting => console.log(greeting))
  .catch(error => console.error(error));
