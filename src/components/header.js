import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component{
    render(){
        let options = this.props.accessibility.map((shop,index) => {
            let text, value;
            switch (shop){
                case "shop_a":
                    text = "فروشگاه الف";
                    value = "shopA"
                    break
                case "shop_b":
                    text = "فروشگاه ب";
                    value = "shopB";
                    break
                case "shop_c":
                    text = "فروشگاه ج";
                    value = "shopC"
                    break
                case "warehouse":
                    text = "انبار";
                    value = "warehouse"
                    break
                default:
                    throw new Error("shop is not valid")        
            }
            return (
            <option key={index} value={value} >{text}</option>
            )
        })
        console.log(options, "options")
        return(
            <select className="custome_input" onChange={(e) => this.props.handleSelect(e.target.value)}>
                <option value="">{this.props.text}</option>
                {options}
            </select>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        accessibility : state.user.accessibility
    }
}



export default connect(mapStateToProps)(Header);