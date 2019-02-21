import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Confirm,
  Form,
  Header,
  Icon,
  Label,
  Loader,
  Modal,
  Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const defaultState = {
  confirmOpen: false,
  newRoverOpen: false,
  newRoverName: null,
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
    const { fetchRovers, createRover } = this.props;
    const { newRoverName } = this.state;

    this.setState(defaultState);

    return createRover({ name: newRoverName }).then(() => fetchRovers());
  }

  render() {
    const { rovers } = this.props;
    const { confirmOpen, focusRover, newRoverOpen } = this.state;

    return (
      <Fragment>
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
          rovers === null
            ? (<Loader active />)
            : (
              <Segment raised style={{ margin: '10px' }}>
                <Header as="h1" textAlign="center">
                  Rovers
                </Header>
                <Card.Group centered>
                  {
                    rovers.map(rover => (
                      <Card key={rover.id}>
                        <Card.Content>
                          <Label corner="right" style={{ borderColor: 'white' }}>
                            {
                              rover.connected ? (
                                <Icon name="circle" color="green" />
                              ) : (
                                <Icon name="circle" color="red" />
                              )
                            }
                          </Label>
                          <Card.Header>
                            {rover.name}
                          </Card.Header>
                          <Card.Meta>
                            {
                              rover.connected ? 'Connected' : 'Not connected'
                            }
                          </Card.Meta>
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
  rovers: null,
};

RoverList.propTypes = {
  fetchRovers: PropTypes.func.isRequired,
  removeRover: PropTypes.func.isRequired,
  createRover: PropTypes.func.isRequired,
  rovers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      connected: PropTypes.bool.isRequired,
    }),
  ),
};

export default RoverList;
