import React from "react";
import { Link } from "react-router-dom";

import "../style/app.css"

const Side = () => {
    return(
        <div className="side">
            <ul>
            <Link to="/">
                    <li>صفحه نخست<i className="fa fa-home"></i></li>
                </Link>
                <Link to="/sellFactor">
                    <li>ایجاد فاکتور فروش<i className="fa fa-file-text"></i></li>
                </Link>
                <Link to="/add-list">
                    <li>ایجاد لیست خرید<i className="fa fa-list-ol" aria-hidden="true"></i></li>
                </Link>
                <Link to="/buyFactor">
                    <li>ایجاد فاکتور خرید<i className="fa fa-shopping-cart"></i></li>
                </Link>
                <Link to="inventory">
                    <li>موجودی<i className="fa fa-list-alt"></i></li>
                </Link>
                <Link to="/recievables">
                    <li>دریافنتی‌ها<i className="fa fa-money"></i></li>
                </Link>
                <Link to="payables">
                    <li>پرداختنی‌ها<i className="fa fa-credit-card"></i></li>
                </Link>
                <Link to="/access">
                    <li>ایجاد دسترسی<i className="fa fa-unlock"></i></li>
                </Link>
                <Link to="/sales-history">
                    <li>فاکتورهای فروش<i className="fa fa-cart-arrow-down"></i></li>
                </Link>
                {/* <Link to="reports">
                    <li>گزارشات<i className="fa fa-signal"></i></li>
                </Link> */}
            </ul>
        </div>
    )
}





export default Side