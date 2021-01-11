import React from 'react';
import StockRow from "./stockRow";
import "../style/app.css"

const Stock = ({data}) => {
    console.log(data, "rows from stock")
    let rows = data ? data.map((s, index) => <StockRow data={s} key={index} />) : null
    return(
        <div className="stock-container">
            <div className="stock-row stock-row-head">
                <div>شماره فاکتور خرید</div>
                <div>شماره پلاک</div>
                <div>مدل</div>
                <div>رنگ</div>
            </div>
            {rows}
        </div>
    )
}

export default Stock