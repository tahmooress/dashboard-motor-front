import React from 'react';



const ListItem = ({item, handleDelete, number}) =>{
    console.log("from listItem")
    return(
        <div className="account-row container-card">
            <div className="item-index">
                {++number}
            </div>
            <div className="list-row">
                <div className="iran pelak">{item.pelakNumber}</div>
                <div><span>مدل:</span>{item.modelName}</div>
            </div>
            <div className="list-row">
                <div><span>شماره شاسی:</span>{item.bodyNumber}</div>
                <div><span>رنگ:</span>{item.color}</div>
            </div >
            <div className="list-row">
                <div><span>سال تولید:</span>{item.modelYear}</div>
                <div onClick={() =>handleDelete(item.pelakNumber)}><button>حذف</button></div>
            </div>
        </div>
    )
}

export default ListItem;