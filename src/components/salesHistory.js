import React, { Component, Fragment } from 'react';
import PaginationWrapper from './pagination';
import { connect } from 'react-redux';
import Header from './header'
import CustomeInput from './input';
import HistoryFactor from './historyFactor';
import SellHistoryRow from './sellHistoryRow';
import "../style/app.css";
import axios from 'axios';
import * as models from '../models/models';
import * as actions from '../store/actions';
import * as util from './utility/utility';

class SalesHistory extends Component{
    constructor(props){
        super(props)
        this.state = {
            select : "",
            search : [],
            salesHistory :[],
            from : "",
            to : "",
            toggle : false
        }
       this.handleFilter = this.handleFilter.bind(this); 
       this.handleCloseFilter = this.handleCloseFilter.bind(this);
       this.handleToggleFalse = this.handleToggleFalse.bind(this);
       this.handleToggleTrue = this.handleToggleTrue.bind(this);
       this.handleShop = this.handleShop.bind(this); 
       this.handleSearch = this.handleSearch.bind(this);
       this.handleDateFrom = this.handleDateFrom.bind(this);
       this.handleDateTo = this.handleDateTo.bind(this);
       this.showRefs = React.createRef();
       this.closeRefs = React.createRef();
    }
    handleCloseFilter(){
        this.handleShop(this.state.select);
        this.showRefs.current.className = "filter";
        this.closeRefs.current.className = "hide"
    }
    handleFilter(e){
        if(!(this.state.from && this.state.to)){
            return
        }
        let from = new Date(this.state.from);
        let to = new Date(this.state.to);
        if(from >= to){
            return
        }
        const URL = "http://localhost:8000/sales-history";
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        let shops = [];
        switch (this.state.select) {
            case "shopA":
                shops.push("shop_a")
                break;
            case "shopB":
                shops.push("shop_b")
                break
            case "shopC":
                shops.push("shop_c")
                break
            case "warehouse":
                shops = ["warehouse"];
                break       
            default:
                break;
        }
        let filter = new models.HistoryFilter(this.state.from, this.state.to, shops);
        console.log(filter, "test filter")
        axios.post(URL, JSON.stringify(filter), option)
        .then(response => {
            if(response.status === 200){
                return response.data
            }else if (response.status === 401){
                this.props.onExit()
                return
            }
            else{
                throw new Error(response.status)
            }
        })
        .then(data =>{
            if(data.err){
                throw new Error(data.err)
            }else{
                this.setState({
                    search : data.result[0].sales
                })
                console.log(data.result[0].sales, "from filter fucn")
            }
           this.showRefs.current.className = "hide";
           this.closeRefs.current.className = "filter";
        })
        .catch(err => alert(err))
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
    handleSearch(e){
        if(this.state.select){
            if(e.target.value === ""){
                this.setState({
                    search : this.state.salesHistory
                })
            }else{
                let v = util.digitConvertor(e.target.value);
                this.setState({
                    search : this.state.salesHistory.filter(item => item.pelakNumber.indexOf(v) !== -1 || item.sellFactor.indexOf(v) !== -1  || item.color.indexOf(v) !== -1)
                })  
            }
        }
    }
    handleDateFrom(date){
        this.setState({
            from : date
        })
    }
    handleDateTo(date){
        this.setState({
            to : date
        })
    }
    handleShop(select){
        if(select){
            this.setState({
                select,
                salesHistory : this.props.salesHistory[select],
                search : this.props.salesHistory[select],
                form : "",
                to : ""
            })
        }else{
            this.setState({
                select : "",
                salesHistory : [],
                search : [],
                form : "",
                to : ""
            })
        }
    }
    render(){
            console.log(this.state, this.props, "from historySlaes")
            const guideText = this.state.select ? null : (<h5>برای نمایش سابقه فروش، ابتدا فروشگاه مورد نظر خود را انتخاب کنید</h5>)
            const WrapedSalesHistory = PaginationWrapper(HistoryFactor, this.state.search);
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
                            <input placeholder="&#xF002; جست‌وجو" className="custome_input" type="text" name="search" autoComplete="off" onChange={this.handleSearch} />
                        </div>
                    </div>
                    <div  className="cal-filter">
                        <div><CustomeInput  placeholder="&#xF073; از تاریخ"  handleSelect={this.handleDateFrom}/></div>
                        <div><CustomeInput  placeholder="&#xF073; تا تاریخ"  handleSelect={this.handleDateTo}/></div>
                        <div ref = {this.closeRefs} className= "hide" onMouseEnter={this.handleToggleTrue} onMouseLeave={this.handleToggleFalse}  onClick={this.handleCloseFilter} ><i className="fa fa-times" aria-hidden="true"></i>{closeFilterText}</div>
                        <div ref = {this.showRefs} className= "filter" onMouseEnter={this.handleToggleTrue} onMouseLeave={this.handleToggleFalse} onClick={this.handleFilter}  ><i className="fa fa-filter" aria-hidden="true"></i>{filterText}</div>
                        
                    </div>
                        <WrapedSalesHistory Mycomponent = {SellHistoryRow} shop={this.state.select} />
                </Fragment>
        )
    }
}


const mapStateTopProps = (state) =>{
    let salesHistory = {}
    state.user.accessibility.map(s => {
        switch (s){
            case "shop_a":
                salesHistory["shopA"] = state.salesHistoryA
                break
            case "shop_b":
                salesHistory["shopB"] = state.salesHistoryB
                break
            case "shop_c":
                salesHistory["shopC"] = state.salesHistoryC
                break
            case "warehouse":
                salesHistory["warehouse"] = state.salesHistoryWareHouse
                break
            default:
                return           
        }
    })
    return{
        salesHistory,
        token : state.user.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onExit : () => dispatch({ type : actions.USER_LOGOUT, payload : {}})
    }
}
export default connect(mapStateTopProps, mapDispatchToProps)(SalesHistory);
