// !NOTE: Define enums with "const" if they will not change later. see the image.png for details.

//Numeric Enums
enum Responses {
  NO, //0
  YES, //1
  MAYBE, //2
}

//String Enums
enum Responses {
  no = "NO",
  yes = "YES",
  maybe = "MAYBE",
}

const enum OrderStatus {
  PENDING,
  SHIPPED,
  DELIVERED,
  RETURNED,
}

const myStatus = OrderStatus.DELIVERED;

function isDelivered(status: OrderStatus) {
  return status === OrderStatus.DELIVERED;
}
