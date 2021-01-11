import React from "react";
import "../style/app.css"

const PaginationNav = ({number, prev, next, handlePage, current, handleColumn})=>{
    const list = []
    for (let i=0; i< number; i++){
        let style = "nav-but"
        if(i === current){
            style += " active"
        }
    list.push(<div key={i+1}><button className={style} onClick={() => handlePage(i)}>{i+1}</button></div>)
    }
    return(
        <div className="pagination-Nav">
            <div >
                <select className="nav-menue" onChange = {(e)=>handleColumn(e.target.value)} >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <div><button className="nav-but" onClick={prev}>&gt;&gt;</button></div>
            {list}
            <div><button className="nav-but" onClick={next}>&lt;&lt;</button></div>
        </div>
    )
}

export default PaginationNav;