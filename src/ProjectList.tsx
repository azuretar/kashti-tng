import React from "react"

import Table from "react-bootstrap/Table"

import { Link } from "react-router-dom"

import moment from "moment"

import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl, { PagingControlProps } from "./components/PagingControl"
import WorkerPhaseIcon from "./WorkerPhaseIcon"

const projectListPageSize = 20

interface ProjectListItemProps {
  project: core.Project
}

interface ProjectListItemState {
  lastEventWorkerPhase?: core.WorkerPhase | null
}

class ProjectListItem extends React.Component<ProjectListItemProps, ProjectListItemState> {

  constructor(props: ProjectListItemProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    const events = await getClient().core().events().list({
      projectID: this.props.project.metadata.id
    })
    this.setState({
      lastEventWorkerPhase: events.items?.length > 0 ? events.items[0].worker?.status.phase : null,
    })
  }

  render(): React.ReactElement {
    const linkTo = "/projects/" + this.props.project.metadata.id
    return (
      <tr>
        <td>
          <WorkerPhaseIcon phase={this.state.lastEventWorkerPhase}/>&nbsp;&nbsp;
          <Link to={linkTo}>{this.props.project.metadata.id}</Link>
        </td>
        <td>{this.props.project.description}</td>
        <td>{moment(this.props.project.metadata.created).fromNow(true)}</td>
      </tr>
    )
  }

}

interface ProjectListProps extends PagingControlProps {}

class ProjectList extends React.Component<ProjectListProps> {

  render(): React.ReactElement {
    const projects = this.props.items as core.Project[]
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {
            projects.map((project: core.Project) => (
              <ProjectListItem key={project.metadata.id} project={project}/>
            ))
          }
        </tbody>
      </Table>
    )
  }

}

export default withPagingControl(ProjectList, (props: any, continueVal: string): Promise<meta.List<core.Project>>  => {
  return getClient().core().projects().list({}, {
    continue: continueVal,
    limit: projectListPageSize
  })
})
