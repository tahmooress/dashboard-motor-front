import React, { Component } from 'react';
import axios from 'axios';
import * as actions from "../store/actions";
import * as util from './utility/utility';
import { connect } from 'react-redux';
import "../style/app.css";
class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            username : "",
            password : "",
            accessibility : []
        }
    }
    changeHandler = (e)=>{
        let v = util.digitConvertor(e.target.value)
        this.setState({
            [e.target.name] : v
        })
    }
    handleSubmit = (e)=>{
        const URL = "http://localhost:8000/login";
        console.log(this.state)
        axios.post(URL,JSON.stringify(this.state)).then(res => res.data).then(data=>{
            console.log(data.accessibility, "accessibility is this")
            if (data.err){
                prompt(data.err)
            }else{
                let user = {
                    userName : this.state.username,
                    token : data.result,
                    accessibility : data.accessibility
                }
                return user
            }
        }).then(user => {
            this.props.onLogin(user)
        })
        .catch(err=>console.error(err))
    }
    render(){
        return(
            (<div className="login-form">
                <div><input type="text" placeholder="username" name="username"  onChange={this.changeHandler} /><i className="fa fa-user"></i></div>
                <div><input type="password" placeholder="password" name="password" onChange={this.changeHandler} /><i className="fa fa-lock"></i></div>
                <div><button className="login-button" onClick={this.handleSubmit}>ورود</button></div>
            </div> )
        )
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        onLogin : (user)=> dispatch({type : actions.USER_LOGIN, payload:{
            user
        }})
    }
}
const mapStateToProps = (state) =>{
    return {
        token : state.user.token
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)