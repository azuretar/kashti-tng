import React from "react"
import { Link } from "react-router-dom"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"
import WorkerPhaseIcon from "./WorkerPhaseIcon"

const eventListPageSize = 10
const itemRefreshInterval = 5000

interface EventListItemProps {
  event: core.Event
}

interface EventListItemState {
  workerPhase?: core.WorkerPhase
}

class EventListItem extends React.Component<EventListItemProps, EventListItemState> {

  // TODO: Let's not have every list item refresh itself. That creates problems
  // if/when one of the items in the list is deleted. Instead, let's make the
  // PagingControl automatically refresh the current page periodically.
  timer?: NodeJS.Timer

  constructor(props: EventListItemProps) {
    super(props)
    this.state = {
      workerPhase: props.event.worker?.status.phase
    }
  }

  refresh = async () => {
    this.setState({
      workerPhase: await (await getClient().core().events().get(this.props.event.metadata?.id || "")).worker?.status.phase
    })
  }

  componentDidMount(): void {
    this.refresh()
    this.timer = setInterval(this.refresh, itemRefreshInterval)
  }

  componentWillUnmount(): void {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  render(): React.ReactElement {
    const linkTo = "/events/" + this.props.event.metadata?.id
    return (
      <div className="box">
        <WorkerPhaseIcon phase={this.state.workerPhase}/>&nbsp;&nbsp;
        <Link to={linkTo}>{this.props.event.metadata?.id}</Link>
      </div>
    )
  }
}

interface EventListProps {
  items: core.Event[]
  projectID?: string
}

// TODO: Make this use a table
class EventList extends React.Component<EventListProps> {

  render(): React.ReactElement {
    const events = this.props.items
    return (
      <div>
        {
          events.map((event: core.Event) => (
            <EventListItem key={event.metadata?.id} event={event}/>
          ))
        }
      </div>
    )
  }

}

export default withPagingControl(EventList, (continueVal: string, selector: core.EventsSelector): Promise<meta.List<core.Event>>  => {
  return getClient().core().events().list(selector, {
    continue: continueVal,
    limit: eventListPageSize
  })
})
