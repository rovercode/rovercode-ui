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
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
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
      id: e.target.parentNode.id || e.target.id,
      name: e.target.parentNode.name || e.target.name,
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
    <Button primary style={{ marginLeft: '10%' }} onClick={this.handleNewRoverOpen}>
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
    const { intl, isFetching, rovers } = this.props;
    const {
      confirmOpen,
      focusRover,
      newRoverOpen,
      newRoverId,
    } = this.state;

    const cancelButtonText = intl.formatMessage({
      id: 'app.rover_list.cancel',
      description: 'Button label to cancel removing rover',
      defaultMessage: 'No',
    });

    const confirmButtonText = intl.formatMessage({
      id: 'app.rover_list.confirm',
      description: 'Button label to confirm removing rover',
      defaultMessage: 'Yes',
    });

    const dialogHeader = intl.formatMessage({
      id: 'app.rover_list.dialog_header',
      description: 'Header for removing rover confirmation dialog',
      defaultMessage: 'Remove Rover',
    });

    const dialogContent = intl.formatMessage({
      id: 'app.rover_list.dialog_content',
      description: 'Asks the user to confirm removing rover',
      defaultMessage: 'Are you sure you want to remove {name}?',
    }, {
      name: focusRover.name,
    });

    const placeholder = intl.formatMessage({
      id: 'app.rover_list.placeholder',
      description: 'Placeholder for rover name entry',
      defaultMessage: 'Rover name',
    });

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
            <FormattedMessage
              id="app.rover_list.create_header"
              description="Header to direct the user to enter the name of the rover"
              defaultMessage="Enter the name of the rover"
            />
          </Modal.Header>
          <Modal.Content>
            <Form id="nameForm" onSubmit={this.createRover}>
              <Form.Input placeholder={placeholder} onChange={this.handleNameChange} required />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button primary type="submit" form="nameForm">
              <FormattedMessage
                id="app.rover_list.dialog_create"
                description="Button label to create the rover"
                defaultMessage="Create"
              />
            </Button>
            <Button onClick={this.handleNewRoverClose}>
              <FormattedMessage
                id="app.rover_list.dialog_cancel"
                description="Button label to cancel creating a rover"
                defaultMessage="Cancel"
              />
            </Button>
          </Modal.Actions>
        </Modal>
        {
          isFetching || rovers === null
            ? (<Loader active />)
            : (
              <Segment raised style={{ margin: '10px 10% 10px 10%' }}>
                <Header as="h1" textAlign="center">
                  <FormattedMessage
                    id="app.rover_list.header"
                    description="Header for the list of rovers"
                    defaultMessage="Rovers"
                  />
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
                            <FormattedMessage
                              id="app.rover_list.configure"
                              description="Button label to configure a rover"
                              defaultMessage="Configure"
                            />
                          </Button>
                          <Button
                            negative
                            id={rover.id}
                            name={rover.name}
                            onClick={this.showConfirm}
                            floated="right"
                          >
                            <FormattedMessage
                              id="app.rover_list.remove"
                              description="Button label to remove a rover"
                              defaultMessage="Remove"
                            />
                          </Button>
                        </Card.Content>
                      </Card>
                    ))
                  }
                </Card.Group>
                {
                  rovers.total_pages > 1 ? (
                    <Grid centered>
                      <Grid.Row>
                        <CustomPagination
                          defaultActivePage={1}
                          totalPages={rovers.total_pages}
                          onPageChange={this.handlePageChange}
                        />
                      </Grid.Row>
                    </Grid>
                  ) : (null)
                }
                <Confirm
                  header={dialogHeader}
                  content={dialogContent}
                  open={confirmOpen}
                  onConfirm={this.removeRover}
                  onCancel={this.cancelRemove}
                  cancelButton={cancelButtonText}
                  confirmButton={confirmButtonText}
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
  intl: intlShape.isRequired,
};

export default injectIntl(RoverList);
