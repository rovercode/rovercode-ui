import React, { Component, Fragment } from 'react';
import {
  Accordion,
  Form,
  Grid,
  Header,
  Icon,
  Loader,
  Message,
  Segment,
  TextArea,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Credential from './Credential';

class RoverDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      config: {},
      accordionActive: false,
      configError: false,
      saveError: false,
      saveSuccess: false,
    };
  }

  componentDidMount() {
    const { fetchRover, id } = this.props;

    return fetchRover(id).then(data => this.setState({
      name: data.value.name,
      config: data.value.config,
    }));
  }

  saveRoverSuccess = () => {
    const { fetchRover, id } = this.props;

    this.setState({
      saveSuccess: true,
    });

    fetchRover(id);
  }

  saveRover = () => {
    const { editRover, id } = this.props;
    const { config, configError, name } = this.state;

    if (configError) {
      this.setState({
        saveError: true,
        saveSuccess: false,
      });
      return null;
    }

    this.setState({
      saveError: false,
      saveSuccess: false,
    });

    return editRover(id, {
      name,
      config,
    }).then(this.saveRoverSuccess);
  }

  handleClick = () => {
    const { accordionActive } = this.state;

    this.setState({
      accordionActive: !accordionActive,
    });
  }

  handleConfigChange = (event) => {
    try {
      this.setState({
        config: JSON.parse(event.target.value),
        configError: null,
      });
    } catch (e) {
      this.setState({
        configError: true,
      });
    }
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  }

  render() {
    const { location, rover } = this.props;
    const {
      accordionActive,
      configError,
      saveError,
      saveSuccess,
    } = this.state;

    return (
      <Grid centered divided="vertically" columns={16}>
        <Grid.Row>
          <Header as="h1">
            Rover Settings
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            {
              saveError ? (
                <Grid.Row>
                  <Message negative>
                    <Message.Header>
                      Error found in configuration
                    </Message.Header>
                    <p>
                      Please fix the error before saving.
                    </p>
                  </Message>
                </Grid.Row>
              ) : (null)
            }
            {
              saveSuccess ? (
                <Grid.Row>
                  <Message positive>
                    Rover configuration saved
                  </Message>
                </Grid.Row>
              ) : (null)
            }
            {
              rover && location && location.state && location.state.created ? (
                <Grid.Row>
                  <Message icon info>
                    <Icon name="arrow down" />
                    {`Rover '${rover.name}' has been created. Click the button below to download the credentials.`}
                  </Message>
                </Grid.Row>
              ) : (null)
            }
            {
              rover === null ? (
                <Loader active />
              ) : (
                <Fragment>
                  <Segment raised>
                    <Form key={rover.id} loading={!rover} onSubmit={this.saveRover}>
                      <Form.Input
                        inline
                        label="Name:"
                        defaultValue={rover.name}
                        onChange={this.handleNameChange}
                        required
                      />
                      <Form.Field error={configError}>
                        <Accordion>
                          <Accordion.Title active={accordionActive} onClick={this.handleClick}>
                            <Icon name="dropdown" />
                            Advanced
                          </Accordion.Title>
                          <Accordion.Content active={accordionActive}>
                            <TextArea
                              defaultValue={JSON.stringify(rover.config)}
                              onChange={this.handleConfigChange}
                            />
                          </Accordion.Content>
                        </Accordion>
                      </Form.Field>
                      <Form.Button primary>
                        Save
                      </Form.Button>
                    </Form>
                  </Segment>
                  <Credential rover={rover} />
                </Fragment>
              )
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

RoverDetail.defaultProps = {
  location: null,
  rover: null,
};

RoverDetail.propTypes = {
  editRover: PropTypes.func.isRequired,
  fetchRover: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      created: PropTypes.bool.isRequired,
    }),
  }),
  rover: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
  }),
};

export default RoverDetail;
