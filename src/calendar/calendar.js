import React, { Component } from 'react';
import Week from './components/week';
import Header from './components/header';
import './styles/calendar.css'
import PersianDate from './calendarLogic';

class Calendar extends Component{
    constructor(props){
        super(props)
        this.state = {
            month : [],
            monthName : "",
            startDay : {},
            lastDay : {},
            selected : {}

        }
        this.handleSelect = this.handleSelect.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this)
    }
    handlePrevious(){
        let persianLastDay = this.state.startDay.dec();
        let persianFirstDay = persianLastDay.firstDayOfMounth()
        this.setState({
            month : PersianDate.createTotalMonth(persianFirstDay),
            monthName : persianFirstDay.monthName,
            startDay : persianFirstDay,
            lastDay : persianLastDay
        })
    }
    handleNext(){
        let persianFirstDay = this.state.lastDay.inc()
        this.setState({
            month : PersianDate.createTotalMonth(persianFirstDay),
            monthName : persianFirstDay.monthName,
            startDay : persianFirstDay,
            lastDay : persianFirstDay.lastDayOfMounth()
        })
    }
    componentDidMount(){
        let today = PersianDate.todayPersian();
        let persianFirstDay = today.firstDayOfMounth();
        let persianLastDay = today.lastDayOfMounth();
        this.setState({
            month : PersianDate.createTotalMonth(persianFirstDay),
            monthName : persianFirstDay.monthName,
            startDay : persianFirstDay,
            lastDay : persianLastDay
        })
    }
    handleSelect(dayObj){
        // this.setState({
        //     selected : dayObj
        // })
        // console.log(dayObj)
        // if(this.props.handleSelect){
        //     this.props.handleSelect(dayObj)
        // }else{
        //     return
        // }
        this.setState({
            selected : dayObj
        })
        console.log(dayObj, "from day called func", this.props.handleSelect);
        this.props.handleSelect(dayObj);
    }
    render(){
        let weeks = this.state.month.map((week, index) =>{
            return(
                <Week key={index} week={week} monthName={this.state.monthName} selected={this.state.selected} handleSelect={this.handleSelect} />
            )
        })
        let year = String(this.state.startDay.year).split("").map(y => PersianDate._dayMap[y])
        return(
            <div className="calendar">
                <div className="cal-controler">
                    <div className="arrow" onClick={this.handleNext}><span>ماه بعد</span><i className="fa fa-angle-double-left" aria-hidden="true"></i></div>
                    <div className="arrow">{this.state.monthName} {year}</div>
                    <div className="arrow" onClick={this.handlePrevious}><i className="fa fa-angle-double-right" aria-hidden="true"></i><span>ماه قبل</span></div>
                </div>
                <Header />
                {weeks}
            </div>
        )
    }
}

export default Calendar;