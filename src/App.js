import React from 'react';
import Login from './components/login';
import "./style/app.css"
import { connect } from "react-redux";
import MyRouter from "./myRouter";


function App(props){
    return props.token ? <MyRouter /> : <Login />
    }
const mapStateToProps = (state) =>{
  return {
    token : state.user.token
  }
}

export default connect(mapStateToProps, null)(App);