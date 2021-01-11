import React, { Component } from "react";
import { Route, Switch }  from 'react-router-dom';
import Home from './components/home';
import Side from './components/side';
import NotFound from "./components/notFound";
import SellFactor from "./components/sellFactor";
import buyFactor from "./components/buyFactor";
import Inventory from "./components/inventory";
import Recievables from "./components/recievables";
import Payables from "./components/payables";
import GrantAccess from "./components/grantAccess";
import SalesHistory from "./components/salesHistory";
import BuyList from "./components/list";
import SalesFactorDetails from "./components/salesFactorDetails";
import { connect } from "react-redux";
import * as actions from "./store/actions";
import axios from "axios";



class MyRouter extends Component{
    constructor(props){
        super(props)
        this.state = {
            firstTime : true,
        }
    }
    componentDidMount(){
        console.log("props", this.props)
        if (this.state.firstTime){
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        const URL_STOCK = "http:///localhost:8000/stock-lookup";
        const URL_SALES = "http://localhost:8000/sales-history";
        const URL_REC = "http://localhost:8000/unrec-list";
        const URL_Pay = "http://localhost:8000/unpay-list";
        let to = new Date();
        let today = new Date()
        let from = new Date(today.setDate(today.getDate() - 30));
        const SalesData = {
            shops : this.props.accessibility,
            from : from.toISOString().toString(),
            to : to.toISOString().toString()
        }
        const reqStock = axios.post(URL_STOCK, JSON.stringify({shops : this.props.accessibility}), option);
        const reqSales = axios.post(URL_SALES, JSON.stringify(SalesData), option);
        const reqRec = axios.post(URL_REC,JSON.stringify({shops : this.props.accessibility}) , option);
        const reqPay = axios.post(URL_Pay, JSON.stringify({ shops : this.props.accessibility}), option);
        axios.all([reqStock, reqSales, reqRec, reqPay]).then(axios.spread((...responses)=> responses)).then(responses =>{
            var data = [];
            for (let i=0; i < responses.length; i++){
                if (responses[i].data.err){
                    throw new Error(responses[i].data.err)
                }
                data.push(responses[i].data.result)

            }
            this.setState({
                firstTime : false
            })
            // console.log("data from here", data)
            return data
        }).then(data =>{
            this.props.onMount(data)
        }).catch(err=>{
            alert(err)
            this.props.onExit()
        })
    }
    }
    render(){
    return(
        <div className="row">
            <div className="main">
                <Switch>
                    <Route exact path="/"  component={Home} />
                    <Route exact path="/sellFactor"  component={SellFactor} />
                    <Route exact path="/buyFactor" component = {buyFactor} />
                    <Route exact path="/inventory" component={Inventory} />
                    <Route exact path = "/recievables" component={Recievables} />
                    <Route exact path = "/payables" component={Payables} />
                    <Route exact path = "/access" component = {GrantAccess} />
                    <Route exact path= "/sales-history" component = {SalesHistory} />
                    <Route exact path= "/add-list" component = {BuyList} />
                    <Route path = "/details/:shop/:factor" component = {SalesFactorDetails} />
                    <Route component = {NotFound} />
                </Switch>
            </div>
            <Side />
        </div>
    )}
}
const mapDispatchToProps = (dispatch) =>{
    return{
        onMount : (responses)=> dispatch({ type : actions.FETCH_ALL, payload : {
            responses
        }}),
        onExit : () => dispatch({ type : actions.USER_LOGOUT, payload : {}})
    }
}
const mapStateToProps = (state) => {
    return{
        accessibility : state.user.accessibility,
        token : state.user.token,

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRouter)