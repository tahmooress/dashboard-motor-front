import React from "react";
import PayRow from "./payRow";
import "../style/app.css";

const AccountsPay = ({data, handleUpdate,handlePart}) => {
    console.log(data, "from accountsPay")
    const list = data ? data.map((d, index) => <PayRow data={d} key={index} handleUpdate={handleUpdate} handlePart={handlePart}/>) : null
    return(
        <div className="accounts-container">
            {list}
        </div>
    )
}

export default AccountsPay;