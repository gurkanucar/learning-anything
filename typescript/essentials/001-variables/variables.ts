let movieTitle: string = "Mission Impossible";
movieTitle = "Arrival";
movieTitle = 9; // Type 'number' is not assignable to type 'string'
movieTitle.toLocaleUpperCase();

let numCatLives: number = 9;
numCatLives += 1;
numCatLives = "zero"; // Type 'string' is not assignable to type 'number'

let gameOver: boolean = false;
gameOver = true;
gameOver = "true"; //Type 'string' is not assignable to type 'boolean'

let nothing: null = null;
let foo: undefined = undefined;

// $ tsc variables.ts
// variables.ts:3:1 - error TS2322: Type 'number' is not assignable to type 'string'.
// 3 movieTitle = 9; // Type 'number' is not assignable to type 'string'
//   ~~~~~~~~~~
// variables.ts:8:1 - error TS2322: Type 'string' is not assignable to type 'number'.
// 8 numCatLives = "zero"; // Type 'string' is not assignable to type 'number'
//   ~~~~~~~~~~~
// variables.ts:12:1 - error TS2322: Type 'string' is not assignable to type 'boolean'.
// 12 gameOver = "true"; //Type 'string' is not assignable to type 'boolean'
//    ~~~~~~~~
// Found 3 errors in the same file, starting at: variables.ts:3

// Type Inference / automatically detect types without write them
let tvShow = "Olive Kitteridge";
tvShow = "The Other Two";
tvShow = false;

// Any
let myComplicatedData: any = "I'm going to be complicated!";
// Can reassign to any type
// Type checks are off for this var now.
myComplicatedData = 87;
myComplicatedData = "abc...";
myComplicatedData = true;

// Delayed Initialization & Implicit Any
const movies = ["Arrival", "The Thing", "Aliens", "Amadeus"];

//Variable 'foundMovie' implicitly has an 'any' type, but a better type may be inferred from usage
let foundMovie;

for (let movie of movies) {
  if (movie === "Arrival") {
    foundMovie = "Arrival";
  }
}

foundMovie();
foundMovie = 1;
foundMovie = false;
