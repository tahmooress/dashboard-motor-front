

export class SellHistory{
    constructor(factorNumber, pelakNumber, color, modelName, price, date){
        this.factorNumber = factorNumber;
        this.pelakNumber = pelakNumber;
        this.color = color;
        this.modelName = modelName;
        this.price = price;
        this.date = date;
    }
}

// export class Buyer{
//     constructor(buyerName, buyerLastName, buyerMobile, buyerNationalCode){
//         this.buyerName = buyerName;
//         this.buyerLastName = buyerLastName;
//         this.buyerMobile = buyerMobile;
//         this.buyerNationalCode = buyerNationalCode;
//     }
// }

// export  class FactorS{
//     constructor(factorNumber, pelakNumber, price, date, buyer, demands, shop){
//         this.factorNumber = factorNumber;
//         this.pelakNumber = pelakNumber;
//         this.price = price;
//         this.date = date;
//         this.buyer = buyer;
//         this.demands = demands;
//         this.shop = shop;
//     }
// }

export class Factor{
    constructor(factorNumber, motor, price, date, customer, debts, shop){
        this.factorNumber = factorNumber;
        this.motor = motor;
        this.price = price;
        this.date = date;
        this.customer = customer;
        this.debts = debts;
        this.shop = shop;
    }
}

export class Motor{
    constructor(pelakNumber, bodyNumber,color, modelName, modelYear, listID){
        this.pelakNumber = pelakNumber;
        this.bodyNumber = bodyNumber;
        this.color = color;
        this.modelName = modelName;
        this.modelYear = modelYear;
    }
}

export class Debt{
    constructor(date, price){
        this.date = date;
        this.price = price;
    }
}

// export class Demand{
//     constructor(date, price){
//         this.date = date;
//         this.price = price;
//     }
// }

// export class List{
//     constructor(){

//     }
// }

export class Customer{
    constructor(customerName, customerLastName, customerMobile, customerNationalCode){
        this.customerName = customerName;
        this.customerLastName = customerLastName;
        this.customerMobile = customerMobile;
        this.customerNationalCode = customerNationalCode;
    }
}

// export class Sale{
//     constructor(factorNumber, pelakNumber, color, price, date, modelName){
//         this.factorNumber = factorNumber;
//         this.pelakNumber = pelakNumber;
//         this.color = color;
//         this.price = price;
//         this.date = date;
//         this.modelName = modelName;
//     }
// }

export class NewFactor{
    constructor(factorNumber, pelakNumber, modelName, color){
        this.factorNumber = factorNumber;
        this.pelakNumber = pelakNumber;
        this.modelName = modelName;
        this.color = color
    }
}

export class Account{
    constructor(factorNumber, pelakNumber, customerName, customerLastName, customerMobile, price, date){
        this.factorNumber = factorNumber;
        this.pelakNumber = pelakNumber;
        this.customerName = customerName;
        this.customerLastName = customerLastName;
        this.customerMobile = customerMobile;
        this.price = price;
        this.date = date;
    }
}

// export class Recieve{
// //     constructor(factorNumber, pelakNumber, buyerName, buyerLastName, mobile, price, date){
// //         this.factorNumber = factorNumber;
// //         this.pelakNumber = pelakNumber;
// //         this.customerName = customerName;
// //         this.customerLastName = customerLastName;
// //         this.customerMobile = customerMobile;
// //         this.price = price;
// //         this.date = date;
// //     }
// // }

export class HistoryFilter{
    constructor(from, to, shops){
        this.from = from;
        this.to = to;
        this.shops = shops
    }
}