
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Header from "./header";
import AccountsPay from "./accountspay";
import CustomeInput from './input';
import "../style/app.css";
import PaginationWrapper from "./pagination";
import * as actions from "../store/actions";
import * as util from './utility/utility';
import axios from "axios";


class Payables extends Component{
    constructor(props){
        super(props)
        this.state = {
            select : "",
            list : [],
            search : [],
            to : "",
            from : "",
            toggle : false,
        }
        this.showRefs = React.createRef();
        this.closeRefs = React.createRef();
        this.handleShop = this.handleShop.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handlePart = this.handlePart.bind(this);
        this.handleDateFrom = this.handleDateFrom.bind(this);
        this.handleDateTo = this.handleDateTo.bind(this);
        this.handleCloseFilter = this.handleCloseFilter.bind(this);
        this.handleToggleTrue = this.handleToggleTrue.bind(this);
        this.handleToggleFalse = this.handleToggleFalse.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }
    handleFilter(){
        if(!(this.state.from && this.state.select)){
            return
        }
        let shop = []
        let to = "";
        let from = new Date(this.state.from);
        if(!this.state.to){
            let today = new Date();
            to =  new Date(today.setDate(today.getDate() + 30));
        }else{
            to = new Date(this.state.to);
        }
        switch(this.state.select){
            case "shopA":
                shop = ["shop_a"]
                break
            case "shopB":
                shop = ["shop_b"]
                break
            case "shopC":
                shop = ["shop_c"]
                break
            case shop = "warehouse":
                shop = ["warehouse"]   
                break
            default:
                return    
        }
        
        const URL = "http://localhost:8000/unpay-list";
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        let filter = {
            shops : shop,
            from,
            to
        }
        axios.post(URL, JSON.stringify(filter), option)
        .then(response =>{
            if(response.status === 200){
                return response.data
            }else if( response.status === 401){
                this.props.onExit();
                return
            }else{
                throw new Error(response.statusText)
            }
        })
        .then(data => {
            if(data.err){
                throw new Error(data.err)
            }else{
                if(data.result.length > 0){
                    this.setState({
                        list : data.result[0].list,
                        search : data.result[0].list
                    })
                }
                this.showRefs.current.className = "hide";
                this.closeRefs.current.className = "filter";
            }
        }).catch(err => alert(err))
    }
    handleToggleTrue(){
        this.setState({
            toggle : true
        })
    }
    handleToggleFalse(){
        this.setState({
            toggle : false
        })
    }
    handleDateFrom(date){
        this.setState({
            from : date
        })
    }
    handleCloseFilter(){
        this.handleShop(this.state.select);
        this.showRefs.current.className = "filter";
        this.closeRefs.current.className = "hide"
    }
    handleDateTo(date){
        this.setState({
            to : date
        })
    }
    handlePart(factor, amount){
        let shop = "";
        switch(this.state.select){
            case "shopA":
                shop = "shop_a"
                break
            case "shopB":
                shop = "shop_b"
                break
            case "shopC":
                shop = "shop_c"
                break
            case shop = "warehouse":
                shop = "warehouse"   
                break
            default:
                return    
        }
        factor = {...factor, shop};
        console.log(factor, amount, "from handlePart");
        const URL = "http://localhost:8000/payable-part";
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        axios.post(URL, JSON.stringify(factor), option)
        .then(response =>{
            if(response.status === 200){
                return response.data
            }else if(response.status === 401){
                this.props.onExit();
                return
            }else{
                throw new Error(response.statusText);
            }
        }).then(data =>{
            if(data.err){
                throw new Error(data.err)
            }else{
                this.props.onPartlyPay(factor, amount);
                alert(data.result);
                this.handleShop(this.state.select)
            }
        })
    }
    handleUpdate(factor){
        console.log(factor)
        let shop = "";
        switch(this.state.select){
            case "shopA":
                shop = "shop_a"
                break
            case "shopB":
                shop = "shop_b"
                break
            case "shopC":
                shop = "shop_c"
                break
            case shop = "warehouse":
                shop = "warehouse"   
                break
            default:
                return    
        }
        const URL = "http://localhost:8000/update-payable";
        factor = {...factor, shop}
        console.log(factor, "second data")
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        if( typeof factor.price === "number"){
            factor.price = String(factor.price);
        }
        axios.put(URL, JSON.stringify(factor), option)
        .then(response =>{
            if(response.status === 200){
                return response.data
            }else if( response.status === 401){
                this.props.onExit()
                return
            }else{
                throw new Error(response.statusText)
            }
        })
        .then(data =>{
            if(data.err){
                throw new Error(data.err)
            }else{
                this.props.onUpdatePay(factor)
                alert(data.result)
                this.handleShop(this.state.select)
            }
        }).catch(err => alert(err))
    }
    handleShop(select){
        if(select){
            this.setState({
                select,
                list : this.props.pays[select],
                search : this.props.pays[select]
            })
        }else{
            this.setState({
                select : "",
                list : [],
                search : []
            })
        }
    }
    handleSearch(e){
        if(this.state.select){
            if(e.target.value === ""){
                this.setState({
                    search : this.state.list
                })
            }else{
                let v = util.digitConvertor(e.target.value)
                this.setState({
                    search : this.state.list.filter(item => item.pelakNumber.indexOf(v) !== -1 || item.factorNumber.indexOf(v) !== -1 || item.customer.customerLastName.indexOf(v) !== -1)
                })  
            }
        }
    }
    render(){
        console.log(this.props, this.state, "from state payables")
        const guideText = this.state.select ? null : (<h5>برای نمایش حساب‌های دریافتنی، ابتدا فروشگاه مورد نظر خود را انتخاب کنید</h5>)
        const Account = PaginationWrapper(AccountsPay, this.state.search);
        const filterText = this.state.toggle ? <div className="filter-message"><h6>اعمال فیلتر</h6></div> : null
        const closeFilterText = this.state.toggle ? <div className="filter-message"><h6>حذف فیلتر</h6></div> : null
        return(
            <Fragment>
                <div className="header-row">
                 {guideText}
                    <div>
                        <Header handleSelect={this.handleShop} text="انتخاب فروشگاه" />
                    </div>
                    <div>
                        <input className="custome_input" type="text" name="search" autoComplete="off" placeholder="&#xF002; جست‌وجو" onChange={this.handleSearch} />
                    </div>
                </div>
                <div  className="cal-filter">
                        <div><CustomeInput  placeholder="&#xF073; از تاریخ"  handleSelect={this.handleDateFrom}/></div>
                        <div><CustomeInput  placeholder="&#xF073; تا تاریخ"  handleSelect={this.handleDateTo}/></div>
                        <div ref = {this.closeRefs} className= "hide" onMouseEnter={this.handleToggleTrue} onMouseLeave={this.handleToggleFalse}  onClick={this.handleCloseFilter} ><i className="fa fa-times" aria-hidden="true"></i>{closeFilterText}</div>
                        <div ref = {this.showRefs} className= "filter" onMouseEnter={this.handleToggleTrue} onMouseLeave={this.handleToggleFalse} onClick={this.handleFilter}  ><i className="fa fa-filter" aria-hidden="true"></i>{filterText}</div>
                        
                    </div>  
                {/* <AccountsPay data={this.state.search} /> */}
                <Account handleUpdate={this.handleUpdate}  handlePart={this.handlePart} />
            </Fragment>

            
        )
    }
}


const mapStateToProps = (state) => {
    let pays = {};
    state.user.accessibility.map(s => {
        switch(s){
            case "shop_a":
                pays["shopA"] = state.payablesA;
                break
            case "shop_b":
                pays["shopB"] = state.payablesB;
                break
            case "shop_c":
                pays["shopC"] = state.payablesC;
                break
            case "warehouse":
                pays["warehouse"] = state.payablesWareHouse;
                break;
            default:
                return    
        }
    })
    return {
        pays,
        token : state.user.token,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        onUpdatePay : (factor) =>dispatch({type : actions.UPDATE_PAYS, payload : {
            factor
        }}),
        onExit : () => dispatch({ type : actions.USER_LOGOUT, payload : {}}),
        onPartlyPay : (factor, amount) => dispatch({ type : actions.PARTLY_UPDATE_PAY, payload : {
            factor,
            amount
        }})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Payables)