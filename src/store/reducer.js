
import * as actions from "./actions";
import * as models from "../models/models";



const initialState = {
    user : {
        userName : "",
        token : "",
        accessibility : []
    },
    shopA : [],
    shopB : [],
    shopC : [],
    wareHouse : [],
    payablesA : [],
    payablesB : [],
    payablesC : [],
    payablesWareHouse : [],
    receivablesA : [],
    receivablesB : [],
    receivablesC : [],
    receivablesWareHouse : [],
    salesHistoryA: [],
    salesHistoryB: [],
    salesHistoryC: [],
    salesHistoryWareHouse: []
}


const reducer = (state = initialState, action ) => {
    // console.log("reducer", action)
    let newState = {...state}
    switch (action.type){
        case actions.USER_LOGIN:
            newState.user =  {...state.user,
                userName : action.payload.user.userName,
                token : action.payload.user.token,
                accessibility : action.payload.user.accessibility
            }
            break;
        case actions.FETCH_ALL:
            let stocks = action.payload.responses[0];
            console.log("stocks", action.payload.responses)
            if (stocks){
                for (let st of stocks){
                    let motors = st.motors;
                    let s = handleInventory(st.shop);
                    newState[s] = [...newState[s], ...motors];
                }
            }
            let salesHistory = action.payload.responses[1];
            if (salesHistory){
                for (let sr of salesHistory){
                    let s = handleSaleHistory(sr["shop"]);
                    let sales = sr["sales"];
                    newState[s] = [...newState[s], ...sales]
                }
            }
            let recieves = action.payload.responses[2];
            if (recieves){
                for (let r of recieves){
                    let s = handleUnrec(r["shop"]);
                    let list = r["list"];
                    newState[s] = [...newState[s], ...list]
                }
            }
            let unpays = action.payload.responses[3];
            if (unpays){
                for (let u of unpays){
                    let s = handleUnpay(u["shop"]);
                    let list = u["list"];
                    newState[s] = [...newState[s], ...list]
                }
            }
            break;
        case actions.SELL_FACTOR:
            let shop = handleSaleHistory(action.payload.shop);
            newState[shop] = [...newState[shop],action.payload.factor ];
            let stock = handleInventory(action.payload.shop);
            newState[stock] = newState[stock].filter(s =>s.buyFactor !== action.payload.factor.factorNumber);
            if(action.payload.factor.debts.length > 0) {
                let shop = handleUnrec(action.payload.shop)
                let recives = []
                for(let d of action.payload.factor.debts){
                    let r = new models.Recieve(action.payload.factor.factorNumber, action.payload.factor.pelakNumber, action.payload.factor.customer.customerName, action.payload.factor.customer.customerLastName, action.payload.factor.customer.mobile, d.price, d.date);
                    recives.push(r);
                }
                newState[shop] = [...newState[shop], ...recives];
            }
            break;
        case actions.BUY_FACTOR:
            console.log(action.payload, "from buy_factor");
            let target = handleInventory(action.payload.shop);
            console.log(target, newState[target],"target")
            let newBuy = new models.NewBuy(action.payload.factor.factorNumber,action.payload.motor.pelakNumber, action.payload.motor.modelName, action.payload.motor.color)
            newState[target] = [...newState[target], newBuy];
            if (action.payload.factor.debts.length > 0){
                let shop = handleUnpay(action.payload.shop);
                let pays = []
                for(let d of action.payload.factor.debts){
                    let p = new models.Pay(action.payload.factor.factorNumber, action.payload.motor.pelakNumber, action.payload.customer.customerName, action.payload.customer.customerLastName, action.payload.customer.mobile, d.price, d.date);
                    pays.push(p)
                }
                newState[shop] = [...newState[shop],...pays];
            }
            break;
        case actions.UPDATE_RECEIVES:
            let ss = handleUnrec(action.payload.factor.shop);
            console.log(ss, "from reducer");
            console.log(newState[ss].filter(item => item.factorNumber !== action.payload.factor.factorNumber && item.date !== action.payload.factor.date))
            // newState[ss] = newState[ss].filter(item => item.factorNumber !== action.payload.factor.factorNumber && item.date !== action.payload.factor.date);
            break;
        case actions.UPDATE_PAYS:
            let tt = handleUnpay(action.payload.factor.shop);
            console.log(tt,newState[tt].filter(item => item.factorNumber !== action.payload.factor.factorNumber && item.date !== action.payload.factor.date))
            // newState[tt] = newState[tt].filter(item => item.factorNumber !== action.payload.factor.factorNumber && item.date !== action.payload.factor.date); 
            break
        case actions.USER_LOGOUT:
            newState = {
                user : {
                    userName : "",
                    token : "",
                    accessibility : []
                },
                shopA : [],
                shopB : [],
                shopC : [],
                wareHouse : [],
                payablesA : [],
                payablesB : [],
                payablesC : [],
                payablesWareHouse : [],
                receivablesA : [],
                receivablesB : [],
                receivablesC : [],
                receivablesWareHouse : [],
                salesHistoryA: [],
                salesHistoryB: [],
                salesHistoryC: [],
                salesHistoryWareHouse: []
            }
            console.log(newState)
            break
        case actions.ADD_LIST:
            console.log("from add to the list reducer", action.payload.shop, action.payload.motors);
            newState[action.payload.shop] = [...newState[action.payload.shop], ...action.payload.motors]
            break
        case actions.PARTLY_UPDATE_PAY:
            let sh = handleUnpay(action.payload.factor.shop);
            newState[sh] = newState[sh].map(item => {
                if(item.factorNumber === action.payload.factor.factorNumber && item.date === action.payload.factor.date){
                    if(Number(item.price) <=  Number(action.payload.amount)){
                        console.log(item.price < action.payload.amount, "test it bitch")
                        return item
                    }else{
                        item.price -= Number(action.payload.amount);
                    }
                }
                return item
            });
            break
        case actions.PARTLY_UPDATE_RECEIVES:
            let hh = handleUnrec(action.payload.factor.shop);
            newState[hh] = newState[hh].map(item => {
                if(item.factorNumber === action.payload.factor.factorNumber && item.date === action.payload.factor.date){
                    if(Number(item.price) <= Number(action.payload.amount)){
                        return item
                    }else{
                        item.price -= Number(action.payload.amount)
                    }
                }});
            break             
        default:
            return newState;    
    }
    console.log(newState, "newState")
    return newState
}

export default reducer;


export function handleInventory(shop){
    switch(shop){
        case "shop_a":
            return "shopA"
        case "shop_b":
            return "shopB"
        case "shop_c":
            return "shopC"
        case "warehouse":
            return "wareHouse"
        default:
            console.log("somethings go wrongs from handleInventory functions")

    }
}

export function handleSaleHistory(shop){
    switch(shop){
        case "shop_a":
            return "salesHistoryA"
        case "shop_b":
            return "salesHistoryB"
        case "shop_c":
            return "salesHistoryC"
        case "warehouse":
            return "salesHistoryWareHouse"
        default:
            console.log("somethings go wrongs from handleSalesHistory functions")        
    }
}

export function handleUnrec(shop){
    switch(shop){
        case "shop_a":
            return "receivablesA";
        case "shop_b":
            return "receivablesB"
        case "shop_c":
            return "receivablesC"
        case "warehouse":
            return "receivablesWareHouse"
        default:
            console.log("somethings go wrongs from handleUnrec functions")
    }
}

export function handleUnpay(shop){
    switch(shop){
        case "shop_a":
            return "payablesA"
        case "shop_b":
            return "payablesB"
        case "shop_c":
            return "payablesC"
        case "warehouse":
            return "payablesWareHouse"
        default:
            console.log("somethings go wrongs from handleUnpay functions")
    }
}
