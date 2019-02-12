import React, { Component, Fragment } from 'react';
import {
  Button, Card, Header, Icon, Label, Loader, Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class RoverList extends Component {
  componentDidMount() {
    const { fetchRovers } = this.props;

    return fetchRovers();
  }

  render() {
    const { rovers } = this.props;
    return (
      <Fragment>
        <Button primary as={Link} to="/rovers/add" style={{ marginLeft: '10px' }}>
          <Icon name="plus" />
          Register New Rover
        </Button>
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
                        </Card.Content>
                      </Card>
                    ))
                  }
                </Card.Group>
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
  rovers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      connected: PropTypes.bool.isRequired,
    }),
  ),
};

export default RoverList;
