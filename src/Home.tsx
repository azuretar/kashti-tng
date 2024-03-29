import React from "react"

import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Image from 'react-bootstrap/Image'
import Row from "react-bootstrap/Row"

import BlogCard from "./home/BlogCard"
import ContributeCard from "./home/ContributeCard"
import ResourcesCard from "./home/ResourcesCard"

import logo from "./images/logo.png"

export default class Home extends React.Component {

  render(): React.ReactElement {
    return (
      <Container>
        <Row>
          <Col className="splash">
            <Image src={logo} fluid/>
          </Col>
        </Row>
        <Row>
          <Col>
            <BlogCard/>
            <Card bg="light">
              <Card.Header>
                Placeholder
              </Card.Header>
              <Card.Body>
                Placeholder
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <ResourcesCard/>
            <ContributeCard/>
          </Col>
        </Row>
      </Container>
    )
  }

}
