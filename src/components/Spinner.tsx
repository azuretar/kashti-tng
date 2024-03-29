import React from "react"

import BootstrapSpinner from "react-bootstrap/Spinner"

export default class Spinner extends React.Component {

  render(): React.ReactElement {
    return (
      <div className="spinner-wrapper">
        <BootstrapSpinner animation="border" variant="primary"/>
      </div>
    )
  }

}
