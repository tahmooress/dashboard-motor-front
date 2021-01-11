import React from 'react';
import PersianDate from '../calendarLogic';
import '../styles/calendar.css';
const Week = ({week, handleSelect,monthName, selected }) => {
    const days = week.map((d,index)=>{
        let style = (index === 6 ) ? "day friday" : "day";
        if (monthName !== d.monthName){
            style += " out_ofrange"
        }
        if (selected.day === d.day && selected.month === d.month && selected.year === d.year){
            style += " selected"
        }
        // if (selected.day === d.day && selected.)
        return <div className={style} key={index} onClick={()=>handleSelect(d)} >{PersianDate._dayMap[d.day]}</div>
    })
    return(
        <div className="week">
            {days}
        </div>
    )
}

export default Week