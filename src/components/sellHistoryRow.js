import React from 'react';
import { Link } from 'react-router-dom';
import * as util from './utility/utility';


const SellHistoryRow = ({data, shop}) => {
    const date = new Date(data.date);
    const price = util.seprator(data.price)
    return(
        <div className="history-factor">
            <div>
                <div>{data.sellFactor}</div>
                <div>{date.toLocaleDateString("fa-IR")}</div>
            </div>
            <div>
                <div>{data.color}</div>
                <div>{price}</div>
            </div>
            <div>
                <div className="iran pelak">{data.pelakNumber}</div>
                <div ><Link to={`/details/${shop}/${data.pelakNumber}`}>مشاهده صورت وضعیت<i className="fa fa-eye-slash check-factor" aria-hidden="true"></i></Link></div>
            </div>
        </div>
    )
}

export default SellHistoryRow;