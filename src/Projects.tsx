import React from "react"

import ProjectList from "./ProjectList"

export default class Projects extends React.Component {

  render(): React.ReactElement {
    return (
      <div>
        <h1>Projects</h1>
        <ProjectList/>
      </div>
    )
  }

}
