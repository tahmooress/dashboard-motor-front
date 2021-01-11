import React from 'react';
import Calender from '../calendar/calendar';
import jalali from 'jalaali-js';

class CustomeInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            display : false,
            date : ""
        }
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleDeleteDate = this.handleDeleteDate.bind(this)
    }
    handleDeleteDate(e){
        if(e.target.value === ""){
            this.setState({
                date : ""
            })
            this.props.handleSelect("")
        }
    }
    toggleDisplay(){
        this.setState(state=>{
            return{
                display : !state.display
            }
        })
    }
    handleDate(date){
        let persianDate = `${date.year}/${date.month}/${date.day}`
        let gdate = jalali.toGregorian(date.year, date.month, date.day);
        let gregorianDate = `${gdate.gy}-${gdate.gm}-${gdate.gd}`
        this.props.handleSelect(gregorianDate)
        this.setState({
            date : persianDate,
            display : false
        })
    }
    render(){
        const child = this.state.display ? <Calender handleSelect={this.handleDate} /> : null
        return(
            <React.Fragment>
                <input onClick={this.toggleDisplay} onChange={this.handleDeleteDate} value = {this.state.date} placeholder={this.props.placeholder}/>
                {child}
            </React.Fragment>
        )
    }
}

export default CustomeInput
