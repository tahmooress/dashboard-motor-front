import React, {Component} from "react";
import axios from "axios";
import { connect } from 'react-redux';
import * as actions from "../store/actions";
import * as models from '../models/models';
import Header from "./header";
import CustomeInput from "./input";
import Result from './result';
import * as util from './utility/utility';
import "../style/app.css"
import PersianDate, {numberPtoE} from '../calendar/calendarLogic';

class BuyFactor extends Component{
    constructor(props){
        super(props)
        this.state = {
            factorNumber : "",
            pelakNumber : "",
            iranPelak : "",
            bodyNumber : "",
            color : "",
            modelName : "",
            modelYear : "",
            date : "",
            price : "",
            customerName : "",
            customerLastName : "",
            customerNationalCode : "",
            customerMobile : "",
            showDebt : false,
            totalPay : "",
            perMounth : "",
            firstPayDate : "",
            debts : [],
            shop : "",
            rsdebts : []
        }
        this.handleToggle = this.handleToggle.bind(this);
    }
    handleToggle(){
        this.setState({
            showDebt : false
        })
    }
    handleSelectShop = (select) => {
        let shop;
        switch (select) {
            case "shopA":
                shop="shop_a"
                break;
            case "shopB":
                shop = "shop_b";
                break
            case "shopC":
                shop = "shop_c";
                break    
            case "warehouse":
                shop = "warehouse";
                break;
            default:
                return;
        }
        this.setState({ shop})
    }
    handleSelectDate = (date) =>{
        this.setState({
            date
        })
        console.log(date, "from date")
    }
    handleChange = (e)=>{
        let v = util.digitConvertor(e.target.value);
        this.setState({
            [e.target.name] : v
        })
    }
    handleSubmit = () =>{
        let iran = this.state.iranPelak + "-";
        let pelakNumber = iran + this.state.pelakNumber
        let motor = new models.Motor(pelakNumber, this.state.bodyNumber, this.state.color, this.state.modelName, this.state.modelYear);
        let customer = new models.Customer(this.state.customerName, this.state.customerLastName, this.state.customerMobile, this.state.customerNationalCode);
        let factor = new models.FactorB(this.state.factorNumber, motor, this.state.price, this.state.date, customer,this.state.debts, this.state.shop);
        console.log(factor,"factor is heteeeee")
        const URL = "http://localhost:8000/buy-factor";
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        if (!this.state.shop) {
            return
        }
        axios.post(URL, JSON.stringify(factor), option)
        .then(response =>{
            if(response.status === 200){
                return response.data
            }else if(response.status === 401){
                this.props.onExit()
            }else{
                throw new Error(response.statusText)
            }
        })
        .then(data =>{
            alert("success" + data.result);
            this.props.onNewBuy({
                shop : this.state.shop,
                motor,
                factor,
                customer
            })
        })
        .catch(err => alert(err))
    }
    firstDebtCalc = (date)=>{
        this.setState({
            firstPayDate : date
        })
    }
    handleDebtCalc = () =>{
        //check for empty values
        if(!(this.state.firstPayDate && this.state.perMounth && this.state.totalPay)){
            console.log(!(this.state.firstPayDate && this.state.perMounth && this.state.totalPay), "from empty")
            return
        }
        let perMountDigit = util.digitConvertor(this.state.perMounth);
        let totalPay = util.digitConvertor(this.state.totalPay);
        let price = util.digitConvertor(this.state.price);
        if(Number(price) < totalPay){
            return
        }
        console.log("perMountDigit: ",perMountDigit, "totalPay: ", totalPay)
        // check if totalpay is less than permonth value
        
        if(Number(perMountDigit) > Number(totalPay)){
            return
        }        
        /* calculating limit */
        let date = new Date(this.state.firstPayDate);
        let persian = date.toLocaleDateString('fa-IR');
        let d = persian.slice(persian.lastIndexOf("/") + 1, persian.length)
        let m = persian.slice(persian.indexOf("/") + 1, persian.lastIndexOf("/"));
        let y = persian.slice(0, persian.indexOf("/"));
        console.log(d,m,y, "rooz o mah o sal")
        let pDate = new PersianDate(numberPtoE(y),numberPtoE(m),numberPtoE(d));
        let limit = pDate.lastDay;
        //************//
        let fp = new Date(this.state.firstPayDate);
        let fd = `${fp.getFullYear()}-${fp.getMonth() +1}-${fp.getDate()}`
        let num = totalPay / perMountDigit;
        let debts = [];
        let rsdebts = [];
        for (let i=0; i< num; i++){
            let c = new models.Debt(fp,this.state.perMounth)
            let temp = new models.Debt(fd, this.state.perMounth)
            debts.push(temp);
            rsdebts.push(c);
            fp = new Date(fp.setDate(fp.getDate() + limit));
            fd = `${fp.getFullYear()}-${fp.getMonth() + 1}-${fp.getDate()}`
        }
        this.setState({
            debts,
            rsdebts,
            showDebt : true
        })
    }
    render(){
        console.log(this.state, "state");
        let result = this.state.debts.length > 0 && this.state.showDebt ? <Result debts={this.state.rsdebts} handleToggle={this.handleToggle} /> : null;
        return(
            <div className="factor_container">
                <div className="factor-select">
                    <h4>فروشگاه صادر کننده فاکتور را انتخاب کنید</h4>
                    <Header handleSelect = {this.handleSelectShop} text="انتخاب فروشگاه صادر کننده"/>
                </div>
                <div className="factor-info">
                    <h4>مشخصات فاکتور</h4>
                    <input name="factorNumber" type="text" placeholder="شماره فاکتور" onChange={this.handleChange} />
                    <CustomeInput id = "date" placeholder="&#xF073; تاریخ صدور"  handleSelect={this.handleSelectDate}/>
                    <input name="price" type="text" placeholder="قیمت خرید" onChange={this.handleChange} />
                </div>
                <div className="motor-info">
                    <h4>مشخصات موتور</h4>
                        <input name="pelakNumber" type="text" placeholder="شماره پلاک" onChange={this.handleChange} />
                        <input className="iran" name="iranPelak" type="text" placeholder="IRAN" onChange={this.handleChange} />
                        <input name="bodyNumber" type="text" placeholder="شماره شاسی" onChange={this.handleChange} />
                        <input name="color" type="text" placeholder="رنگ" onChange={this.handleChange} />
                        <input name="modelName" type="text" placeholder="نام مدل" onChange={this.handleChange} />
                        <input name="modelYear" type="text" placeholder="سال تولید" onChange={this.handleChange} />
                </div>
                <div className="person-info">
                    <h4>مشخصات فروشنده</h4>
                    <input name="customerName" type="text" placeholder="نام" onChange={this.handleChange} />
                    <input name="customerLastName" type="text" placeholder="نام خانوادگی" onChange={this.handleChange} />
                    <input name="customerNationalCode" type="text" placeholder="کد ملی" onChange={this.handleChange} />
                    <input name="customerMobile" type="text" placeholder="شماره موبایل" onChange={this.handleChange} />
                </div>
                <div className="debt-info">
                    <h4>محاسبه اقساط</h4>
                    <input type="text" name="totalPay" placeholder="کل مبلغ مانده" onChange={this.handleChange} />
                    <input type="text" name="perMounth" placeholder="مبلغ هر قسط" onChange={this.handleChange} />
                    <CustomeInput placeholder="&#xF783; تاریخ پرداخت اولین قسط" handleSelect={this.firstDebtCalc} />
                    <button className="debt-cal" onClick={this.handleDebtCalc}>محاسبه</button>
                </div>
                { result }
                <div className="factor-submit">
                    <button onClick={this.handleSubmit}>ثبت فاکتور</button>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        token : state.user.token,
        accessibility : state.user.accessibility
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onNewBuy : (data) => dispatch({type : actions.BUY_FACTOR, 
            payload : 
            {
                shop : data.shop,
                motor : data.motor,
                // debts : data.debts,
                factor : data.factor,
                customer : data.customer
            }
        }),
        onExit : () => dispatch({ type : actions.USER_LOGOUT, payload : {}})
            }
}            

export default connect(mapStateToProps, mapDispatchToProps)(BuyFactor);