import React from "react"

import ServiceAccountList from "./ServiceAccountList"

export default class ServiceAccounts extends React.Component {

  render(): React.ReactElement {
    return (
      <div>
        <h1>Service Accounts</h1>
        <ServiceAccountList/>
      </div>
    )
  }

}
