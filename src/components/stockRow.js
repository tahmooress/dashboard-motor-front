import React from "react";
import "../style/app.css"
const StockRow = ({data}) => {
    console.log(data, "data from stockRow")
    return(
        <div className="stock-row">
            <div>{data.buyFactor }</div>
            <div className="iran">{data.pelakNumber}</div>
            <div>{data.modelName}</div>
            <div>{data.color}</div>
        </div>
    )
}


export default StockRow;