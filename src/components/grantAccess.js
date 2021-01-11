import React, { Component } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import * as actions from '../store/actions';
class GrantAccess extends Component {
    constructor(props){
        super(props)
        this.state = {
            accessibility : [],
            username : "",
            password : "",
            confirm : "",
            hover : false
        }
        this.passRef = React.createRef();
        this.accessHandle = this.accessHandle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMouseIn = this.handleMouseIn.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }
    accessHandle(e){
        if(e.target.checked){
            this.setState(state =>{
                return {
                    accessibility : [...state.accessibility, e.target.value]
                }
            })
        }else{
            this.setState(state =>{
                return {
                    accessibility : state.accessibility.filter(item => item !== e.target.value)
                }
            })
        }
    }
    handleChange(e){
        this.setState({
                [e.target.name] : e.target.value
        })
        if(this.passRef.current.className === "warning" && e.target.name === "confirm"){
            console.log("yes");
            this.passRef.current.className = ""
        }
    }
    handleMouseIn(){
        this.setState({
            hover : true
        })
    }
    handleMouseOut(){
        this.setState({
            hover : false
        })
    }
    handleSubmit(e){
        this.setState(state=>{
            if(state.password !== "" && state.password === state.confirm){
                this.passRef.current.className = ""
                const URL = "http://localhost:8000/create-user";
                const option = {
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${this.props.token}`
                    }
                }
                let data = {
                    accessibility : this.state.accessibility,
                    username : this.state.username,
                    password : this.state.password
                }
                axios.post(URL, JSON.stringify(data), option)
                .then(response => {
                    if(response.status === 200){
                        return response.data
                    }else if (response.status === 401){
                        this.props.onExit()
                    }
                    else{
                        throw new Error(`error happend with status code: ${response.status}`)
                    }
                })
                .then(data => {
                    if(data.err){
                        throw new Error(data.err)
                    }else{
                        alert(data.result)
                    }
                }).catch(err => alert(err))
            }else{
                this.passRef.current.focus();
                console.log(this.passRef.current.className);
                this.passRef.current.className = "warning"
            }
        })

        
    }
    render(){
        console.log(this.state, "from raido button");
        const hover = this.state.hover ? <div className="hover">دسترسی‌های کاربر را مشخص کنید</div> : null
                       
        return(
            <div className="access-container">
                <div className="checkbox-container" onMouseEnter={this.handleMouseIn} onMouseLeave={this.handleMouseOut} >
                    {hover}
                    <div>
                        <input type="checkbox" onChange={this.accessHandle}  value="shop_a" name="shop_a" />
                        <span>فروشگاه الف</span>
                    </div>
                    <div>
                       <input type="checkbox" onChange={this.accessHandle}  value="shop_b" name="shop_b" />
                       <span>فروشگاه ب</span>
                    </div>
                    <div>
                       <input type="checkbox" onChange={this.accessHandle}  value="shop_c" name="shop_c" />
                       <span>فروشگاه ج</span>
                    </div>
                    <div>
                       <input type="checkbox" onChange={this.accessHandle}  value="warehouse" name="warehouse" />
                        <span>انبار</span>
                    </div>
                </div>
                <div className="user-info-container">
                    <div>
                        <span>نام کاربری:</span>
                        <input  onChange={this.handleChange} placeholder="نام کاربری" type="text"  name="username"  />
                    </div>
                    <div>
                        <span>رمز ورود:</span>
                        <input onChange={this.handleChange} placeholder="رمز عبور" type="password" name="password" />
                    </div>
                    <div>
                        <span>تکرار رمز ورود:</span>
                        <input onChange={this.handleChange} placeholder="تکرار رمز عبور" type="password" name="confirm" ref={this.passRef} className=""/>
                    </div>
                </div>
                <div className="user-submit">
                    <button onClick={this.handleSubmit}>ایجاد دسترسی</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        token : state.user.token
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        onExit : () => dispatch({ type : actions.USER_LOGOUT, payload : {}})
    }
}
export default connect(mapStateToProps,mapDispatchToProps )(GrantAccess);