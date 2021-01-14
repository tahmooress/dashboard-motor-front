
import React, { Component } from "react";
import "../style/app.css";
import * as util from './utility/utility';

class RecieveRow extends Component{
    constructor(props){
        super(props)
        this.state = {
            amount : "",
            toggle : false
        }
        this.handleToggle = this.handleToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdatePartly = this.handleUpdatePartly.bind(this);
    }
    handleChange(e){
        let v = util.digitConvertor(e.target.value)
        this.setState({
            amount : v
        })
    }
    handleToggle(){
        this.setState(state => {
            return{
                toggle : !state.toggle
            }
        })
    }
    handleUpdatePartly(){
        this.setState({
            toggle : false,
            amount : ""
        })
        this.props.handlePart(this.props.data, this.state.amount)
    }
    render(){
        const data = this.props.data
        const date = new Date(data.date);
        const price = util.seprator(data.price)
        const display = this.state.toggle ? (
            <div className="update-part">
                <div onClick={() => this.handleToggle()}><i className="fa fa-times" aria-hidden="true"></i></div>
                <div><input name="amount" type="text" onChange={this.handleChange} placeholder="مبلغ" /></div>
                <div><button onClick={this.handleUpdatePartly}>پرداخت</button></div>
            </div>
        ) : null
        return(
            <div className="accounts-row" >
                <div className="item-row">
                    <div>نام: {data.customer.customerName}</div>
                    <div>نام خانوادگی: {data.customer.customerLastName}</div>
                    <div>موبایل: {data.customer.customerMobile}</div>
                </div>
                <div className="item-row">
                    <div >شماره فاکتور: {data.factorNumber}</div>
                    <div className="iran pelak">{data.pelakNumber}</div>
                    <div>تاریخ: {date.toLocaleDateString("fa-IR")}</div>
                </div>
                <div className="item-row">
                    <div>بدهی: {price}</div>
                    <div><button onClick={()=>this.props.handleUpdate(data)}>تسویه</button></div>
                    <div><button onClick={() => this.handleToggle()}>بروز رسانی</button></div>
                    {display}
                </div>
            </div>
    )
    }
}
export default RecieveRow;