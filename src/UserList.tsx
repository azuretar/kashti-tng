import React from "react"

import Table from "react-bootstrap/Table"

import { Link } from "react-router-dom"

import moment from "moment"

import { authn, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import LockIcon from "./LockIcon"
import withPagingControl from "./PagingControl"

const userListPageSize = 20

interface UserListItemProps {
  user: authn.User
}

class UserListItem extends React.Component<UserListItemProps> {

  render(): React.ReactElement {
    const user = this.props.user
    const linkTo = "/users/" + this.props.user.metadata.id
    return (
      <tr>
        <td>
          <LockIcon locked={user.locked ? true : false}/>&nbsp;&nbsp;
          <Link to={linkTo}>{this.props.user.metadata.id}</Link>
        </td>
        <td>{this.props.user.name}</td>
        <td>{moment(this.props.user.metadata.created).fromNow()}</td>
      </tr>
    )
  }
}

interface UserListProps {
  items: authn.User[]
}

class UserList extends React.Component<UserListProps> {

  render(): React.ReactElement {
    const users = this.props.items
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>First Seen</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map((user: authn.User) => (
              <UserListItem key={user.metadata.id} user={user}/>
            ))
          }
        </tbody>
      </Table>
    )
  }

}

export default withPagingControl(UserList, (continueVal: string): Promise<meta.List<authn.User>>  => {
  return getClient().authn().users().list({}, {
    continue: continueVal,
    limit: userListPageSize
  })
})
