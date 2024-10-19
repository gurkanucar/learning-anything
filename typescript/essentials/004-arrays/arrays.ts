const activeUsers: string[] = ["colt"];
activeUsers.push("steven");
//Argument of type 'number' is not assignable to parameter of type 'string'
activeUsers.push(123);

// Array of numbers
const ageList: number[] = [45, 56, 13];
ageList[0] = 99;

// Alternate Syntax:
const bools: Array<boolean> = [];
// const bools: boolean[] = [];

type Point = {
  x: number;
  y: number;
};

const coords: Point[] = [];
coords.push({ x: 4, y: 6 });

// Multi-dimensional string array
const board: string[][] = [
  ["X", "O", "X"],
  ["X", "O", "X"],
  ["X", "O", "X"],
];
