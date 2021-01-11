import React, { Component, Fragment } from "react";
import Stock from "./stock";
import Header from "./header";
import PaginationWrapper from "./pagination";
import {connect} from "react-redux";
import * as actions from "../store/actions";
import * as util from './utility/utility';
import "../style/app.css"
class Inventory extends Component {
    constructor(props){
        super(props)
        this.state = {
            select : "",
            search : [],
            stock :[]
        }
       this.handleShop = this.handleShop.bind(this); 
       this.handleSearch = this.handleSearch.bind(this);
    }
    handleShop(select){
        if(select){
            this.setState({
                select,
                stock : this.props.shops[select],
                search : this.props.shops[select]
            })
        }else{
            this.setState({
                select : "",
                stock : [],
                search : []
            })
        }
    }
    handleSearch(e){
        console.log(e.target.value, "from handle search")
        if(this.state.select){
            if (e.target.value === ""){
                this.setState({
                    search : this.state.stock
                })
            }else{
                let v = util.digitConvertor(e.target.value);
                this.setState({
                    search : this.state.stock.filter(item => item.pelakNumber.indexOf(v) !== -1 || item.color.indexOf(v) !== -1 || item.modelName.indexOf(v) !== -1 )
                })
            }
        }
    }
    render(){
        const guideText = this.state.select ? null : (<h5>برای نمایش موجودی، ابتدا فروشگاه مورد نظر خود را انتخاب کنید</h5>)
        const Account = PaginationWrapper(Stock, this.state.search);
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
                    <Account />
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    let shops = {};
    state.user.accessibility.map(s => {
        switch (s){
            case "shop_a":
                shops["shopA"] = state.shopA
                break
            case "shop_b":
                shops["shopB"] = state.shopB
                break
            case "shop_c":
                shops["shopC"] = state.shopC
                break
            case "warehouse":
                shops["warehouse"] = state.wareHouse
                break
            default:
                return           
        }
    })
   return {shops}
}

const mapDispatchToProps = (dispatch) =>{
    return{
        onAddInventory : (item) => dispatch({type : actions.ADD_INVENTORY, payload : {
            item
        }})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Inventory)