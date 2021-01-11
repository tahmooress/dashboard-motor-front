import React from "react";
import RecieveRow from "./recieveRow";
import "../style/app.css";

const AccountsRes = ({data, handleUpdate, handlePart}) => {
    console.log(data, "from")
    const list = data ? data.map((d, index) =>  <RecieveRow handleUpdate={handleUpdate} handlePart={handlePart} data={d} key={index} />) : null
    return(
        <div className="accounts-container">
            {list}
        </div>
    )
}

export default AccountsRes;