import React, { Component } from 'react';
import {connect} from 'react-redux';
import Result from './result';
import * as models from '../models/models';
import { handleUnrec, handleSaleHistory, handleInventory} from '../store/reducer';

class SalesFactorDetails extends Component{
    constructor(props){
        super(props)
        this.state = {
            motor : {},
            buyer : {},
            debts : [],
            factorNumber : "",
            totalAmount : "",
            date : "",
            totalDebt : ""
        }
    }
    componentDidMount(){
        let pelakNumber = this.props.match.params.factor;
        let shop = this.props.match.params.shop;
        let s;
        switch (shop) {
            case "shopA":
                s = "shop_a"
                break;
            case "shopB":
                s = "shop_b"
                break
            case "shopC":
                s = "shop_c"
                break
            case "warehouse":
                s = "warehouse";
                break    
            default:
                break;
        }
        let recievShop = handleUnrec(s);
        let historyShop = handleSaleHistory(s);
        let inventory = handleInventory(s);
        console.log(recievShop, historyShop, inventory)
        let receivables = this.props.store[recievShop].filter(r => r.pelakNumber === pelakNumber);
        let saleHistory = this.props.store[historyShop].filter( s => s.pelakNumber === pelakNumber);
        let buyer = new models.Customer(receivables[0].buyerName, receivables[0].buyerLastName, receivables[0].mobile);
        console.log("buyer is :", receivables.buyerName, receivables.buyerLastNamem, receivables.mobile);
        let motor = new models.Motor(pelakNumber, null, saleHistory[0].color, saleHistory[0].modelName);
        //calculating total debts:
        let totalDebt = this.state.totalDebt;
        receivables.map(r =>{
            let v = r.price;
            let reference = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            let paterns = [/۰/g , /۱/g , /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g ];
            for(let i=0; i <10; i++){
               v = v.replace(paterns[i], reference[i])
            }
            totalDebt += v
        } )
        this.setState({
            totalAmount : saleHistory[0].price,
            factorNumber : saleHistory[0].sellFactor,
            debts : receivables,
            buyer,
            date : saleHistory[0].date,
            motor,
            totalDebt
        })
        console.log(receivables, saleHistory, buyer)
    }
    render(){
        const receivables = this.state.debts.length > 0 ? <Result debts={this.state.debts} /> : null
        console.log(this.state)
        return(
            <div>
                <div>
                    <div>شماره فاکتور: <span>{this.state.factorNumber}</span></div>
                    <div>تاریخ: <span>{this.state.date}</span></div>
                </div>
                <div>
                    <div className="iran pelak">{this.state.pelakNumber}</div>
                    <div>نام مدل:<span>{this.state.motor.modelName}</span></div>
                    <div>رنگ: <span>{this.state.motor.color}</span></div>
                </div>
                <div>
                    <div>نام:<span>{this.state.buyer.buyerName}</span></div>
                    <div>نام خانوادگی:<span>{this.state.buyer.buyerLastName}</span></div>
                    <div>موبایل:<span>{this.state.buyer.buyerMoblie}</span></div>
                </div>
                <div>
                    <div>قیمت فروش: <span>{this.state.saleHistory[0].price}</span></div>
                    <div>بدهی: <span>{this.state.totalDebt}</span></div>
                </div>
                {receivables}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { 
        store : state
    }
}


export default connect(mapStateToProps)(SalesFactorDetails);


