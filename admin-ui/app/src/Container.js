import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";

const mapStateToProps = state => ({state: state})
//equiv to  const mapStateToProps = state => ({state})

class Container extends Component {
  render(){
    console.log(this.props)
    return (<div>Storage</div>)
  }
}

export default drizzleConnect(Container, mapStateToProps);
