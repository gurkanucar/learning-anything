// Parameter 'num' implicitly has an 'any' type, but a better type may be inferred from usage
function square(num) {
  return num * num;
}
// does not care given parameter types
square(3);
square("asd");
square(true);

// creating a function with typed args
const encourageStudent = (name: string) => {
  return `Hey ${name}, you're doing GREAT!`;
};

// can call this function
encourageStudent("John");

//Argument of type 'number' is not assignable to parameter of type 'string'
encourageStudent(85);

const doSomething = (person: string, age: number, isFunny: boolean) => {
  console.log(person, age, isFunny);
};
doSomething("name", 25, true);

// default values for parameters
const greet = (person: string = "stranger") => {
  return `Hi there ${person}!`;
};
greet();
greet("John");

// function return types
const addNums = (x: number, y: number): number => x + y;
addNums(3, 5);

// it inferences possible return types automatically
function random(num: number) {
  //function random(num: number): string | number
  if (Math.random() < 0.5) {
    return num.toString();
  }
  return num;
}

// Anonymous Functions
// ts can infer parameter types from context
const numbers = [1, 2, 3];

// Contextual typing on an arrow function
numbers.forEach((num) => {
  return num.toUpperCase();
  //.toUpperCase() doesn't work for nums
});

// Void
const sayHello = (num: number): void => {
  for (let i = 0; i < num; i++) {
    console.log("Hi!");
  }
};

// Never: for dont return anything
function makeError(msg: string): never {
  throw new Error(msg);
}

function gameLoop(): never {
  while (true) {
    console.log("GAME LOOP RUNNING!");
  }
}
