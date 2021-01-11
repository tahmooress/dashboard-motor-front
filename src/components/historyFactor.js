import React from 'react';


const HistoryFactor = ({data, Mycomponent, shop}) => {
    const list = data ?  data.map((d, index) => <Mycomponent data={d} shop={shop} key={index} />) : null
    return(
        <div className="history-container">
            {list}
        </div>
    )
}

export default HistoryFactor;