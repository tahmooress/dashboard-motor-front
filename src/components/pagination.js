import React, { Component } from "react";
import PaginationNav from "./paginationNav";

const PaginationWrapper = (WrappedComponent, componentProps) =>{
    return class  extends Component {
        constructor(props){
            super(props)
            this.state = {
                start : 0,
                end : 0,
                column : 10,
                current : 0,
                dataBunch : []
            }
            this.handlePage = this.handlePage.bind(this);
            this.prev = this.prev.bind(this);
            this.next = this.next.bind(this);
            this.handleColumns = this.handleColumns.bind(this)
        }
        handleColumns(n){
            console.log(n, "from handleColumns ...")
            let column = Number(n);
            let end = Math.ceil(componentProps.length / column);
            if(componentProps.length > column){
                    let data = new Array(end);
                    for (let i=0; i < end ; i++){
                        data[i] = componentProps.slice(i * column, (i+1) * column);
                        console.log(data[i], "this is data[i] from change column");
                    }
                    this.setState({
                        dataBunch : data,
                        column : column,
                        end : end
                    })
            }else{
                // console.log([componentProps], " testterr")
                this.setState({
                    dataBunch : [componentProps],
                    column : column,
                    end : end
                })
            }
        }
        handlePage(n){
            console.log( n, "check")
            if(this.state.current !== n){
                this.setState({
                    current : n
                })
            }
        }
        prev(){
            if(this.state.current > 0){
                this.setState(state => {
                    return {
                        current : --state.current 
                    }
                })
            }
        }
        next(){
            if(this.state.current + 1 < this.state.end){
                this.setState(state =>{
                    return {
                        current : ++state.current 
                    }
                })
            }
        }
        componentDidMount(){
            let end = Math.ceil(componentProps.length / this.state.column);
            this.setState({
                end : Math.ceil(componentProps.length / this.state.column)
            })
            if(componentProps.length > this.state.column){
                console.log("hereeeeee from pagination", this.state.end)
                    let data = new Array(end);
                    for (let i=0; i < end ; i++){
                        data[i] = componentProps.slice(i * this.state.column, (i+1) * this.state.column);
                        console.log(data[i], "this is data[i]");
                    }
                    console.log(data, "total data from pagination")
                    this.setState({
                        dataBunch : data
                    })
                
            }else{
                console.log([componentProps], " testterr")
                this.setState({
                    dataBunch : [componentProps]
                })
            }
        }
        render(){
        console.log(componentProps,"from pagination", this.state, this.props)
            return(
                <div className="pagination-container">
                    <div className="pagination-body" >
                        <WrappedComponent {...this.props}  data={this.state.dataBunch[this.state.current]} />
                    </div>
                    {componentProps && componentProps.length !== 0  ? (<PaginationNav number={this.state.end} current={this.state.current} next={this.next} prev = {this.prev} handlePage={this.handlePage} handleColumn={this.handleColumns} />) : null } 
                </div>
            )
        }
    }
}

export default PaginationWrapper;