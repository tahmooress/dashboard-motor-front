import React from 'react';
import * as util from './utility/utility';

const Result = ({debts, handleToggle}) =>{
    const list = debts.map((debt, index)=>{
        return(
            <div key={index} className="result-deb-container">
                <div>{index +1 }</div>
                <div>{debt.date.toLocaleDateString('fa-IR')}</div>
                <div>{util.seprator(debt.price)}</div>
            </div>
        )
    })
    return(
        <div className="result-container">
            <div className="result-title">
                <div><h4>اقساط</h4></div>
                <div onClick={() => handleToggle()}><i className="fa fa-times" aria-hidden="true"></i></div>
            </div>
            <div className="result-header">
                <div>ردیف</div>
                <div>تاریخ</div>
                <div>مبلغ</div>
            </div>
            {list}
        </div>
    )
}
export default Result;