// Objects: can be typed by declaring what the object should look like in the annotation

// A function with an object type parameter
const printName = (name: { first: string; last: string }) => {
  return `Name: ${name.first} ${name.last}`;
};
printName({ first: "John", last: "Doe" });

let coordinate: { x: number; y: number } = { x: 34, y: 2 };

function randomCoordinate(): { x: number; y: number } {
  return { x: Math.random(), y: Math.random() };
}

// you can not add new varaibles if not exist in type
//Object literal may only specify known properties,
// and 'age' does not exist in type '{ first: string; last: string; }'
printName({ first: "John", last: "Doe", age: 20 });

// but if you define first with additional params then call it will work.
const person: { first: string; last: string; age: number } = {
  first: "John",
  last: "Doe",
  age: 20,
};
printName(person);

//////////////////
// Type Aliases //
//////////////////

type Person = {
  name: string;
  age: number;
};
const sayHappyBirthday = (person: Person) => {
  return `Hey ${person.name}, congrats on turning ${person.age}`;
};

sayHappyBirthday({ name: "Jerry", age: 24 });

////////////////////
// Nested Objects //
////////////////////

type Song = {
  title: string;
  artist: string;
  numStreams: number;
  credits: {
    producer: string;
    writer: string;
  };
};

function calculatePayout(song: Song): number {
  return song.numStreams * 0.33;
}
function printSong(song: Song): void {
  console.log(`${song.title}`);
}

const mySong: Song = {
  title: "Unchained Melody",
  artist: "artist abc",
  numStreams: 120000,
  credits: {
    producer: "Phill",
    writer: "Alex North",
  },
};

printSong(mySong);

/////////////////////////
// Optional Properties //
/////////////////////////

type Point = {
  x: number;
  y: number;
  z?: number;
};

const myPoint: Point = { x: 1, y: 2 };

/////////////////////////
// Readonly Properties //
/////////////////////////

type User = {
  readonly id: number;
  username: string;
};

const user: User = { id: 123, username: "user123" };
console.log(user.id);
//Cannot assign to 'id' because it is a read-only property
user.id = 321;

/////////////////////////
// Intersection Types //
/////////////////////////

type Circle = {
  radius: number;
};

type Colorful = {
  color: string;
};

type ColorfulCircle = Circle & Colorful;

const happyface: ColorfulCircle = {
  radius: 4,
  color: "yellow",
};

type Cat = {
  numLives: number;
};
type Dog = {
  breed: string;
};

type CatDog = Cat &
  Dog & {
    age: number;
  };

const christy: CatDog = {
  numLives: 9,
  breed: "Husky",
  age: 5,
};
