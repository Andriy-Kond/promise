// Change value of isSuccess variable to call resolve or reject
const isSuccess = true;
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
