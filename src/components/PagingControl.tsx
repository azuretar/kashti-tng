import React from "react"

import NextButton from "./NextButton"
import PreviousButton from "./PreviousButton"
import Spinner from "./Spinner"

interface Page<T> {
  items: T[]
  metadata: {
    continue?: string
  }
}

interface PagingControlState<T> {
  prevContinueVals: string[]
  currentContinueVal: string,
  items: T[]
  nextContinueVal?: string
}

// TODO: Need to make this thing auto-refresh
export default function withPagingControl<T, T1>(
  fetch: (props: T, continueVal: string) => Promise<Page<T1>>,
  render: (items: T1[], props: T) => React.ReactElement
) {

  return class extends React.Component<T, PagingControlState<T1>> {
    
    constructor(props: T) {
      super(props)
      this.state = {
        prevContinueVals: [],
        currentContinueVal: "",
        items: []
      }
    }

    async componentDidMount(): Promise<void> {
      const page = await fetch(this.props, "")
      this.setState({
        items: page.items,
        nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
      })
    }

    fetchPreviousPage = async () => {
      const prevContinueVals = this.state.prevContinueVals
      if (prevContinueVals.length > 0) {
        const currentContinueVal = prevContinueVals.pop() || ""
        const page = await fetch(this.props, currentContinueVal)
        this.setState({
          prevContinueVals: prevContinueVals,
          currentContinueVal: currentContinueVal,
          items: page.items,
          nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
        })
      }
    }

    fetchNextPage = async () => {
      let nextContinueVal = this.state.nextContinueVal
      if (nextContinueVal) {
        const prevContinueVals = this.state.prevContinueVals
        prevContinueVals.push(this.state.currentContinueVal)
        const currentContinueVal = nextContinueVal
        const page = await fetch(this.props, currentContinueVal)
        this.setState({
          prevContinueVals: prevContinueVals,
          currentContinueVal: currentContinueVal,
          items: page.items,
          nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
        })
      }
    }

    render(): React.ReactElement {
      const items = this.state.items
      if (!items) {
        return <div/>
      }
      if (items.length === 0) {
        return <Spinner/>
      }
      const hasPrev = this.state.prevContinueVals.length > 0
      const hasMore = this.state.nextContinueVal ? true : false
      return (
        <div>
          { render(items, this.props) }
          <div className="paging-controls">
            { hasPrev && <PreviousButton onClick={this.fetchPreviousPage}/> }
            { hasMore && <NextButton onClick={this.fetchNextPage}/> }
          </div>
        </div>
      )
    }

  }

}
