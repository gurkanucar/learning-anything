// Interfaces serve almost the exact same purpose aas type aliases.
// We can use them to create reusable, modular types that describe the shapes of objects

interface Person {
  readonly id: number;
  name: string;
  age: number;
  nickname?: string;
  sayHi: () => string;
}

const sayHappyBirthday = (person: Person) => {
  return `Hey ${person.name}, congrats on turning ${person.age}`;
};

const jerry: Person = {
  id: 1,
  name: "Jerry",
  age: 42,
  sayHi: () => {
    return "hello!";
  },
};

sayHappyBirthday(jerry);

//////////////////////////

interface Product {
  name: string;
  price: number;
  applyDiscount(discount: number): number;
}

const shoes: Product = {
  name: "Blue Suede Shoes",
  price: 100,
  applyDiscount(amount: number) {
    const newPrice = this.price * (1 - amount);
    this.price = newPrice;
    return this.price;
  },
};

shoes.applyDiscount(0.4);
