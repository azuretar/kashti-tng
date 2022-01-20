import React from "react"
import { useParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Nav from "react-bootstrap/Nav"

import getClient from "./Client"
import LogStreamer from "./LogStreamer"
import JobPhaseIcon from "./JobPhaseIcon"
import YAMLViewer from "./YAMLViewer"

interface EventProps {
  id: string
}

interface EventState {
  event?: core.Event
}

class Event extends React.Component<EventProps, EventState> {

  // TODO: Make the event page auto-refresh

  constructor(props: EventProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      event: await getClient().core().events().get(this.props.id)
    })
  }

  render(): React.ReactElement {
    const event = this.state.event
    if (!event) {
      return <div/>
    }
    // TODO: Break these tabs up into two sections
    return (
      <div>
        <h1>{event?.metadata?.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <EventSummary event={event}/>
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <YAMLViewer object={event}/>
          </Tab>
          { event.git ? <Tab eventKey="git-initializer-logs" title="Git Initializer Logs"><LogStreamer event={event} containerName="vcs" logKey="vcs"/></Tab> : null }
          <Tab eventKey="worker-logs" title="Worker Logs">
            <LogStreamer event={event} logKey={event?.metadata?.id || ""}/>
          </Tab>
          <Tab eventKey="jobs" title="Jobs">
            <JobList event={event}/>
          </Tab>
        </Tabs>
      </div>
    )
  }

}

export default function RoutedEvent(): React.ReactElement {
  const pathParams = useParams()
  return <Event id={pathParams.id || ""}/>
}

interface EventSummaryProps {
  event?: core.Event
}

class EventSummary extends React.Component<EventSummaryProps> {

  render(): React.ReactElement {
    // TODO: Create a placeholder component that uses an alert box
    // https://react-bootstrap.github.io/components/alerts/
    return <div className="box">Placeholder</div>
  }

}

// TODO: This might be easier to mentally map to the UI if it is renamed to JobTabPaneProps.
interface JobListItemProps {
  event: core.Event
  job: core.Job
}

// TODO: This might be easier to mentally map to the UI if it is renamed to JobTabPane.
class JobListItem extends React.Component<JobListItemProps> {

  render(): React.ReactElement {
    const event = this.props.event
    const job = this.props.job
    // TODO: Break these tabs up into two sections
    return (
      <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
        <Tab eventKey="summary" title="Summary">
          <div className="box">Placeholder</div>
        </Tab>
        <Tab eventKey="yaml" title="YAML">
          <YAMLViewer object={job}/>
        </Tab>
        <Tab eventKey={job.name} title="Primary Container Logs">
          <LogStreamer event={event} jobName={job.name} logKey={job.name}/>
        </Tab>
        {
          Object.keys(job.spec.sidecarContainers || {}).map((containerName: string) => (
            <Tab eventKey={containerName} title={`${containerName} logs`}>
              <LogStreamer event={event} jobName={job.name} containerName={containerName} logKey={`${job.name}-${containerName}`}/>
            </Tab>
          ))
        }
      </Tabs>
    )
  }

}

// TODO: This might be easier to mentally map to the UI if it is renamed to JobTabsProps.
interface JobListProps {
  event: core.Event
}

// TODO: This might be easier to mentally map to the UI if it is renamed to JobTabs.
class JobList extends React.Component<JobListProps> {

  render(): React.ReactElement {
    const event = this.props.event
    const jobs = event.worker?.jobs
    if (!jobs || jobs.length === 0) {
      return <div className="box">There are no jobs associated with this event.</div>
    }
    const defaultJobName = jobs[0].name
    return (
      <Tab.Container defaultActiveKey={defaultJobName}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {
                jobs.map((job: core.Job) => (
                  <Nav.Item>
                    {/* TODO: Fix use of any below after https://github.com/brigadecore/brigade-sdk-for-js/pull/59 is taken care of and SDK v2.1.0 is released. */}
                    <Nav.Link eventKey={job.name}><JobPhaseIcon phase={(job as any).status?.phase}/>&nbsp;&nbsp;{job.name}</Nav.Link>
                  </Nav.Item>
                ))
              }
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {
                jobs.map((job: core.Job) => (
                  <Tab.Pane eventKey={job.name} mountOnEnter>
                    <JobListItem key={job.name} event={event} job={job}/>
                  </Tab.Pane>
                ))
              }
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }

}
