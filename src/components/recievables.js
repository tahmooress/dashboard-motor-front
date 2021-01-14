
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Header from "./header";
import AccountsRes from "./accountres";
import Pagination from "./pagination";
import CustomeInput from './input';
import "../style/app.css";
import axios from "axios";
import * as actions from "../store/actions";
import * as util from './utility/utility';

class Recievables extends Component{
    constructor(props){
        super(props)
        this.state = {
            select : "",
            list : [],
            search : [],
            show : false,
            from : "",
            to : "",
            toggle : false
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
            to = new Date(this.state.to)
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
        
        const URL = "http://localhost:8000/unrec-list";
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
        console.log(filter, "from filter recieves")
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
                if (data.result){
                    this.setState({
                        list : data.result[0].list,
                        search : data.result[0].list
                    })
                }
                this.showRefs.current.className = "hide";
                this.closeRefs.current.className = "filter";
            }
        }).catch(err => alert(`handle filter From receivables: ${err}`))
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
        console.log(factor, amount, "from berooz resany")
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
        let price = factor.price - amount
        factor.price = String(price)
        factor = {...factor, shop};
        const URL = "http://localhost:8000/partyl-pay";
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
                this.props.onPartlyRec(factor, amount);
                alert(data.result);
                this.handleShop(this.state.select)
            }
        })
    }
    handleShop(select){
        if(select){
            this.setState({
                select,
                list : this.props.accounts[select],
                search : this.props.accounts[select]
            })
        }else{
            this.setState({
                select : "",
                list : [],
                search : []
            })
        }
    }
    handleUpdate(factor){
        console.log(factor, "from factor update")
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
        const URL = "http://localhost:8000/update-recive";
        factor = {...factor, shop}
        console.log(factor, "second data")
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        axios.put(URL, JSON.stringify(factor), option)
        .then(response =>{
            if(response.status === 200){
               return response.data
            }else if(response.status === 401){
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
                this.props.onUpdateRecives(factor)
                alert(data.result)
                this.handleShop(this.state.select)
            }
        })
        // .then(res => {
        //     console.log("fro res to check refresh")
        //     if(res){
        //         this.setState({
        //             list : this.props.accounts[this.state.select],
        //             serach : this.props.accounts[this.state.select]
        //         })
        //     }
        // })
        .catch(err => alert(err))
    }
    handleSearch(e){
        if(this.state.select){
            if(e.target.value === ""){
                this.setState({
                    search : this.state.list
                })
            }else{
                let v = util.digitConvertor(e.target.value);
                this.setState({
                    search : this.state.list.filter(item => item.pelakNumber.indexOf(v) !== -1 || item.factorNumber.indexOf(v) !== -1 || item.customer.customerLastName.indexOf(v) !== -1)
                })  
            }
        }
    }
    render(){
        console.log(this.props, this.state, "from state")
        const guideText = this.state.select ? null : (<h5>برای نمایش حساب‌های دریافتنی، ابتدا فروشگاه مورد نظر خود را انتخاب کنید</h5>)
        const Account = Pagination(AccountsRes,this.state.search);
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
                 {/* <AccountsRes data={this.state.search} /> */}
                 <Account handleUpdate={this.handleUpdate} handlePart={this.handlePart}/>
            </Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    let accounts = {};
    state.user.accessibility.map(s => {
        switch(s){
            case "shop_a":
                accounts["shopA"] = state.receivablesA;
                break
            case "shop_b":
                accounts["shopB"] = state.receivablesB;
                break
            case "shop_c":
                accounts["shopC"] = state.receivablesC;
                break
            case "warehouse":
                accounts["warehouse"] = state.receivablesWareHouse;
                break;
            default:
                return {
                    actions,
                    token : state.user.token
                }
        }
    })
    return {
        accounts,
        token : state.user.token,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onUpdateRecives : (factor)=>dispatch({type : actions.UPDATE_RECEIVES, payload : {
            factor
        }}),
        onExit : () => dispatch({ type : actions.USER_LOGOUT, payload : {}}),
        onPartlyRec : (factor, amount) => dispatch({ type : actions.PARTLY_UPDATE_RECEIVES, payload : {
            factor,
            amount
        }})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Recievables)