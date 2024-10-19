const guessAge = (age: number | string) => {
  return `Your age is ${age}`;
};

// Can pass numver or string
guessAge(20);
guessAge("25");

type Point = {
  x: number;
  y: number;
};

type Loc = {
  lat: number;
  long: number;
};

let coordinates: Point | Loc = { x: 1, y: 4 };
coordinates = { lat: 24.324, long: 53.123 };

/////////////////////
// Type Narrowing  //
/////////////////////

function calculateTax(price: number | string, tax: number) {
  //Property 'replace' does not exist on type 'string | number'.
  // Property 'replace' does not exist on type 'number'
  price.replace("$", "");
  //The left-hand side of an arithmetic operation must be of type 'any',
  // 'number', 'bigint' or an enum type
  return price * tax;
}

function calculateTaxes(price: number | string, tax: number) {
  if (typeof price === "string") {
    price = parseFloat(price.replace("$", ""));
  }
  return price * tax;
}

calculateTaxes(100, 28);
calculateTaxes("$100", 28);

// Union Type With Arrays
const coords: (Point | Loc)[] = [];
coords.push({ lat: 321.213, long: 23.334 });
coords.push({ x: 213, y: 43 });

/////////////////////
// Literal Types  //
/////////////////////

const givenAnswer = (answer: "yes" | "no" | "maybe") => {
  return `The answer is ${answer}`;
};

// can provide one of the literals in the union
givenAnswer("yes");
// can't provided anything else
givenAnswer("oh boy I'm not sure");

type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

let today: DayOfWeek = "Sunday";
