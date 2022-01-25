import React from "react"

import Table from "react-bootstrap/Table"

import { Link } from "react-router-dom"

import moment from "moment"

import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"
import Spinner from "./Spinner"
import WorkerPhaseIcon from "./WorkerPhaseIcon"

const projectListPageSize = 20

interface ProjectListItemProps {
  project: core.Project
}

interface ProjectListItemState {
  lastEventWorkerPhase?: core.WorkerPhase
  ready: boolean
}

class ProjectListItem extends React.Component<ProjectListItemProps, ProjectListItemState> {

  constructor(props: ProjectListItemProps) {
    super(props)
    this.state = {
      ready: false
    }
  }

  async componentDidMount(): Promise<void> {
    const events = await getClient().core().events().list({
      projectID: this.props.project.metadata.id
    })
    this.setState({
      lastEventWorkerPhase: events.items?.length > 0 ? events.items[0].worker?.status.phase : undefined,
      ready: true,
    })
  }

  render(): React.ReactElement {
    const ready = this.state.ready
    const linkTo = "/projects/" + this.props.project.metadata.id
    return (
      <tr>
        <td>
          {
            ready ? 
              <WorkerPhaseIcon phase={this.state.lastEventWorkerPhase}/>    
            :
              <Spinner/>
          }&nbsp;&nbsp;
          <Link to={linkTo}>{this.props.project.metadata.id}</Link>
        </td>
        <td>{this.props.project.description}</td>
        <td>{moment(this.props.project.metadata.created).fromNow(true)}</td>
      </tr>
    )
  }

}

interface ProjectListProps {
  items: core.Project[]
}

class ProjectList extends React.Component<ProjectListProps> {

  render(): React.ReactElement {
    const projects = this.props.items
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

export default withPagingControl(ProjectList, (continueVal: string): Promise<meta.List<core.Project>>  => {
  return getClient().core().projects().list({}, {
    continue: continueVal,
    limit: projectListPageSize
  })
})
