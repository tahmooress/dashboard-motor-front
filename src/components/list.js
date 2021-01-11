import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../store/actions';
import Header from './header';
import CustomeInput from './input';
import ListItem from './listItem';
import * as models from '../models/models';
import * as util from "./utility/utility";
import axios from 'axios';
class BuyList extends Component{
    constructor(props){
        super(props)
        this.state = {
            select : "",
            date : "",
            provider : "",
            amount : "",
            toggle : false,
            pelakNumber : "",
            iranPelak : "",
            bodyNumber : "",
            color : "",
            modelName : "",
            modelYear : "",
            motors : []

        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddToList = this.handleAddToList.bind(this);
        this.toggleTrue = this.toggleTrue.bind(this);
        this.toggleFalse = this.toggleFalse.bind(this);
        this.handleShop = this.handleShop.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectDate = this.handleSelectDate.bind(this);
        this.handleAddToStore = this.handleAddToStore.bind(this);
    }
    handleAddToStore(){
        const URL = "http://localhost:8000/entry-list";
        const option = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }
        let shop;
        switch (this.state.select) {
            case "shopA":
                shop = "shop_a";
                break;
            case "shopB":
                shop = "shop_b";
                break
            case "shopC":
                shop = "shop_C";
                break
            case "warehouse":
                shop = "warehouse";
                break
            default:
                break;
        }
        let list = {
            provider : this.state.provider,
            date : this.state.date,
            amount : this.state.amount,
            motors : this.state.motors,
            shop : shop
            }
        axios.post(URL, JSON.stringify(list), option)
        .then(response =>{
            if(response.status === 200){
                return response.data
            }else if(response.status === 401){
                this.props.onExit()
            }
            else{
                throw new Error(response.statusText)
            }
        })
        .then(data =>{
            if(data.err){
                throw new Error(data.err)
            }else{
                this.props.AddToList(list.motors, this.state.select)
                alert(data.result)
                this.setState({
                    motors : []
                })
            }
        })
        .catch(err => alert(err))
    }
    handleDelete(pelakNumber){
        console.log(pelakNumber);
        this.setState({
            motors : this.state.motors.filter(item => item.pelakNumber !== pelakNumber)
        })
    }
    handleAddToList(){
        //check if values of motor or date or shop are null 
        for (let s in this.state){
            if(!this.state[s]){
                return
            }
        }
        let pelakNumber = this.state.iranPelak + "-" + this.state.pelakNumber;
        let item = new models.Motor(pelakNumber, this.state.bodyNumber, this.state.color, this.state.modelName, this.state.modelYear);
        let newMotors = this.state.motors;
        newMotors.unshift(item)
        this.setState({
            // motors : [...this.state.motors, item],
            motors : newMotors,
            pelakNumber : "",
            iranPelak : "",
            bodyNumber : "",
            color : "",
            modelName : "",
            modelYear : "",
        })
    }
    toggleTrue(){
        this.setState({
            toggle : true
        })
    }
    toggleFalse(){
        this.setState({
            toggle : false
        })
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
    handleShop(select){
        if(select){
            this.setState({
                select,
                // items : []
            })
        }else{
            this.setState({
                select : "",
            })
        }
    }
    render(){
        console.log(this.state)
        const result = this.state.motors.length > 0 ? this.state.motors.map((item, index) => <ListItem item={item} key={index} number={index} handleDelete={this.handleDelete} />) : null
        const addToText = this.state.toggle ? <div className="add_text"><div>اضافه کن به لیست</div></div> : null;
        const submit = this.state.motors.length > 0 ? (<div><div className="submit-list"><button onClick={this.handleAddToStore}>ثبت نهایی</button></div></div>) : null;
        console.log(result, "from result list")
        return(
            <div className="factor_container">
                <div className="text"> <h4>فروشگاه صادر کننده و تاریخ صدور فاکتور را انتخاب کنید</h4></div>
                <div className="add-header">
                    <div >
                        <CustomeInput id = "date" placeholder="&#xF073; تاریخ صدور"  handleSelect={this.handleSelectDate}/>
                    </div>
                    <div>
                        <Header handleSelect={this.handleShop} text="انتخاب فروشگاه" />
                    </div>
                </div>
                <div className="text-provider"> <h4>فروشگاه صادر کننده و تاریخ صدور فاکتور را انتخاب کنید</h4></div>
                <div className="add-header">
                    <div>
                        <input name="provider" type="text" placeholder="تامیین کننده" onChange={this.handleChange} value = {this.state.provider} />
                    </div>
                    <div>
                        <input name="amount" type="text" placeholder="مبلغ کل" onChange={this.handleChange} value = {this.state.amount} />
                    </div>
                </div>
                <div className="add-form">
                    <div className="motor-info">
                        <h4>مشخصات موتور</h4>
                            <input name="pelakNumber" type="text" placeholder="شماره پلاک" onChange={this.handleChange} value={this.state.pelakNumber}/>
                            <input className="iran" name="iranPelak" type="text" placeholder="IRAN" onChange={this.handleChange} value={this.state.iranPelak}/>
                            <input name="bodyNumber" type="text" placeholder="شماره شاسی" onChange={this.handleChange} value={this.state.bodyNumber} />
                            <input name="color" type="text" placeholder="رنگ" onChange={this.handleChange} value={this.state.color} />
                            <input name="modelName" type="text" placeholder="نام مدل" onChange={this.handleChange} value={this.state.modelName} />
                            <input name="modelYear" type="text" placeholder="سال تولید" onChange={this.handleChange} value = {this.state.modelYear} />
                    </div>
                    <div className="plus" onClick={this.handleAddToList} onMouseLeave={this.toggleFalse} onMouseEnter={this.toggleTrue}><i className="fa fa-plus-circle" aria-hidden="true"></i>{addToText}</div>
                </div>
                {result}
                {submit}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        token : state.user.token,
        // accessibility : state.user.accessibility
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        AddToList : (motors, shop) => dispatch({ type : actions.ADD_LIST, payload : {
            motors,
            shop
        }}),
        onExit : () => dispatch({ type : actions.USER_LOGOUT, payload : {}})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BuyList)