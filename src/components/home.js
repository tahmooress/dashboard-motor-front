
import React from 'react';
import { connect } from 'react-redux';
import "../style/app.css"
import * as actions from "../store/actions"
const Home = (props)=>{
    return (
            <div className="user-profile">
                <div onClick={() => props.onExit()}>
                    <i className="fa fa-power-off"></i><span>{props.userName}</span>
                </div>
            </div>
    )
}

const mapStateToProps = (state)=>{
    return {
         userName : state.user.userName,
         token : state.user.token,
         accessibility : state.user.accessibility
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onExit : () => dispatch({ type : actions.USER_LOGOUT, payload : {
            
        }})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)