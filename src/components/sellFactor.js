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
import PersianDate, {numberPtoE} from '../calendar/calendarLogic'
class SellFactor extends Component{
    constructor(props){
        super(props)
        this.state = {
            factorNumber : "",
            pelakNumber : "",
            bodyNumber : "",
            color : "",
            modelName : "",
            modelYear : "",
            date : "",
            price : "",
            buyerName : "",
            buyerLastName : "",
            buyerNationalCode : "",
            buyerMobile : "",
            modal : false,
            totalPay : "",
            perMounth : "",
            firstPayDate : "",
            demands : [],
            shop : "",
            rsdebts : [],
            showDebt : false,
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
                break
            default:
                break;
        }
        console.log("select : ",select, "shop :",shop)
        this.setState({ shop})
    }
    handleDebt = () => {
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
        let demands = [];
        let rsdebts = [];
        for (let i=0; i< num; i++){
            let c = new models.Demand(fp,this.state.perMounth)
            let temp = new models.Demand(fd, this.state.perMounth)
            demands.push(temp);
            rsdebts.push(c);
            fp = new Date(fp.setDate(fp.getDate() + limit));
            fd = `${fp.getFullYear()}-${fp.getMonth() + 1}-${fp.getDate()}`
        }
        this.setState({
            demands,
            rsdebts,
            showDebt : true
        })
        
    }
    handleChange = (e)=>{
        let v = util.digitConvertor(e.target.value);
        this.setState({
            [e.target.name] : v
        })
    }
    handleSelectDate = (date)=>{
        this.setState({
            date
        })
    }
    firstDebtCalc = (date)=>{
        this.setState({
            firstPayDate : date
        })
    }
    // handleSelectShop = (select) => this.setState({ shop : select})
    handleSubmit = (e) => {
        const URL = "http://localhost:8000/sell-factor";
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        if (!this.state.shop) {
            return
        }
        let buyer = new models.Buyer(this.state.buyerName, this.state.buyerLastName, this.state.buyerMobile, this.state.buyerNationalCode);
        let factor = new models.FactorS(this.state.factorNumber, this.state.pelakNumber, this.state.price, this.state.date, buyer, this.state.demands, this.state.shop);
        axios.post(URL, JSON.stringify(factor), option)
        .then(response =>{
            if(response.status === 200){
                return response.data
            }else if (response.status === 401){
                this.props.onExit()
                return
            }else{
                throw new Error(response.statusText)
            }
        })
        .then(data => {
            if (data.err){
                alert(data.err)
            }else {
                console.log(data)
                alert("success" + data.result);
                this.props.onNewSell({
                    shop : this.state.shop,
                    // motor,
                    factor,
                })
            }
        })
        .catch(err => alert(err))
    }
    render(){
        console.log("sell factor state : ", this.state)
        let result = this.state.demands.length > 0 && this.state.showDebt ? <Result debts={this.state.rsdebts} handleToggle={this.handleToggle} /> : null
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
                    <input name="price" type="text" placeholder="قیمت فروش" onChange={this.handleChange} />
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
                    <h4>مشخصات خریدار</h4>
                    <input name="buyerName" type="text" placeholder="نام" onChange={this.handleChange} />
                    <input name="buyerLastName" type="text" placeholder="نام خانوادگی" onChange={this.handleChange} />
                    <input name="buyerNationalCode" type="text" placeholder="کد ملی" onChange={this.handleChange} />
                    <input name="buyerMobile" type="text" placeholder="شماره موبایل" onChange={this.handleChange} />
                </div>
                <div className="debt-info">
                    <h4>محاسبه اقساط</h4>
                    <input type="text" name="totalPay" placeholder="کل مبلغ مانده" onChange={this.handleChange} />
                    <input type="text" name="perMounth" placeholder="مبلغ هر قسط" onChange={this.handleChange} />
                    <CustomeInput placeholder="&#xF783; تاریخ پرداخت اولین قسط" handleSelect={this.firstDebtCalc} />
                    <button className="debt-cal" onClick={this.handleDebt}>محاسبه</button>
                </div>
                { result }
                <div className="factor-submit">
                    <button  onClick={this.handleSubmit}>ثبت فاکتور</button>
                </div>
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) =>{
    return{
        onNewSell : (data) => dispatch({ type : actions.SELL_FACTOR, payload : {
            factor : data.factor,
            // motor : data.motor,
            shop : data.shop,
            // demands : data.demands
        } }),
        onExit : () => dispatch({type : actions.USER_LOGOUT, payload : {}})
    }
}

const mapStateToProps = (state) => {
    return {
        token : state.user.token,
        accessibility : state.user.accessibility
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SellFactor)