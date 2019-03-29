import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Confirm,
  Form,
  Grid,
  Header,
  Icon,
  Loader,
  Modal,
  Segment,
} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import CustomPagination from './CustomPagination';

const defaultState = {
  confirmOpen: false,
  newRoverOpen: false,
  newRoverName: null,
  newRoverId: null,
  focusRover: {
    id: null,
    name: null,
  },
};

class RoverList extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount() {
    const { fetchRovers } = this.props;

    return fetchRovers();
  }

  showConfirm = e => this.setState({
    confirmOpen: true,
    focusRover: {
      id: e.target.id,
      name: e.target.name,
    },
  })

  cancelRemove = () => this.setState(defaultState)

  removeRover = () => {
    const { fetchRovers, removeRover } = this.props;
    const { focusRover } = this.state;

    this.setState(defaultState);

    return removeRover(focusRover.id).then(() => fetchRovers());
  }

  modalButton = () => (
    <Button primary style={{ marginLeft: '10px' }} onClick={this.handleNewRoverOpen}>
      <Icon name="plus" />
      Register New Rover
    </Button>
  )

  handleNewRoverOpen = () => this.setState({ newRoverOpen: true })

  handleNewRoverClose = () => this.setState({ newRoverOpen: false })

  handleNameChange = e => this.setState({ newRoverName: e.target.value })

  createRover = () => {
    const { createRover } = this.props;
    const { newRoverName } = this.state;

    this.setState(defaultState);

    return createRover({ name: newRoverName }).then(newRover => this.setState({
      newRoverId: newRover.value.id,
    }));
  }

  handlePageChange = (e, { activePage }) => {
    const { fetchRovers } = this.props;

    return fetchRovers(activePage);
  }

  render() {
    const { isFetching, rovers } = this.props;
    const {
      confirmOpen,
      focusRover,
      newRoverOpen,
      newRoverId,
    } = this.state;

    return (
      <Fragment>
        {
          newRoverId ? (
            <Redirect to={{
              pathname: `/rovers/${newRoverId}`,
              state: { created: true },
            }}
            />
          ) : (null)
        }
        <Modal trigger={this.modalButton()} open={newRoverOpen} onClose={this.handleNewRoverClose}>
          <Modal.Header>
            Enter the name of the rover
          </Modal.Header>
          <Modal.Content>
            <Form id="nameForm" onSubmit={this.createRover}>
              <Form.Input placeholder="Rover name" onChange={this.handleNameChange} required />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button primary type="submit" form="nameForm">
              Create
            </Button>
            <Button onClick={this.handleNewRoverClose}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
        {
          isFetching || rovers === null
            ? (<Loader active />)
            : (
              <Segment raised style={{ margin: '10px' }}>
                <Header as="h1" textAlign="center">
                  Rovers
                </Header>
                <Card.Group centered>
                  {
                    rovers.results.map(rover => (
                      <Card key={rover.id}>
                        <Card.Content>
                          <Card.Header>
                            {rover.name}
                          </Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                          <Button primary as={Link} to={`/rovers/${rover.id}`}>
                              Configure
                          </Button>
                          <Button
                            negative
                            id={rover.id}
                            name={rover.name}
                            onClick={this.showConfirm}
                            floated="right"
                          >
                              Remove
                          </Button>
                        </Card.Content>
                      </Card>
                    ))
                  }
                </Card.Group>
                <Grid centered>
                  <Grid.Row>
                    <CustomPagination
                      defaultActivePage={1}
                      totalPages={rovers.total_pages}
                      onPageChange={this.handlePageChange}
                    />
                  </Grid.Row>
                </Grid>
                <Confirm
                  header="Remove Rover"
                  content={`Are you sure you want to remove ${focusRover.name}?`}
                  open={confirmOpen}
                  onConfirm={this.removeRover}
                  onCancel={this.cancelRemove}
                  cancelButton="No"
                  confirmButton="Yes"
                />
              </Segment>
            )
        }
      </Fragment>
    );
  }
}

RoverList.defaultProps = {
  rovers: {
    next: null,
    previous: null,
    total_pages: 1,
    results: [],
  },
  isFetching: false,
};

RoverList.propTypes = {
  fetchRovers: PropTypes.func.isRequired,
  removeRover: PropTypes.func.isRequired,
  createRover: PropTypes.func.isRequired,
  rovers: PropTypes.shape({
    next: PropTypes.string,
    previous: PropTypes.string,
    total_pages: PropTypes.number,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
  isFetching: PropTypes.bool,
};

export default RoverList;
