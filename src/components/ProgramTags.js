import React, { Component } from 'react';
import { Button, Dropdown, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies } from 'react-cookie';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import { checkAuthError, authHeader } from '@/actions/auth';
import { changeProgramTags as actionChangeProgramTags } from '@/actions/code';
import { fetchTags as actionFetchTags } from '@/actions/tag';

const mapStateToProps = ({ code, tag }) => ({ code, tag });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchTags: () => dispatch(actionFetchTags(authHeader(cookies))).catch(checkAuthError(dispatch)),
  changeProgramTags: (id, tags) => dispatch(actionChangeProgramTags(id, tags, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
});

class ProgramTags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localTags: [],
      addOptions: [],
      changed: false,
    };
  }

  componentDidMount() {
    const { code, fetchTags } = this.props;

    fetchTags();

    this.setState({
      localTags: code.tags,
    });
  }

  handleChange = (event, data) => {
    this.setState({
      localTags: data.value,
      changed: true,
    });
  }

  handleSave = () => {
    const { changeProgramTags, code } = this.props;
    const { localTags } = this.state;

    changeProgramTags(code.id, localTags).then(() => this.setState({
      changed: false,
    }));
  }

  addItem = (event, data) => {
    const newOption = {
      key: data.value,
      text: data.value,
      value: data.value,
    };

    this.setState(prevState => ({
      addOptions: [...prevState.addOptions, newOption],
    }));
  }

  render() {
    const { code, tag, intl } = this.props;
    const { addOptions, changed, localTags } = this.state;

    const tagPlaceholder = intl.formatMessage({
      id: 'app.program_tags.placeholder',
      description: 'Placeholder for tags input',
      defaultMessage: 'Add tags...',
    });

    const additionLabel = intl.formatMessage({
      id: 'app.program_tags.addition',
      description: 'Label for adding a new tag',
      defaultMessage: 'Add',
    });

    let options = tag.tags.map(globalTag => ({
      key: globalTag.name,
      text: globalTag.name,
      value: globalTag.name,
    }));

    if (addOptions.length) {
      options = options.concat(addOptions);
    }

    return (
      <Grid centered container>
        <Grid.Row>
          <Dropdown
            fluid
            search
            selection
            multiple
            allowAdditions
            closeOnChange
            additionLabel={`${additionLabel} `}
            options={options}
            disabled={code.isReadOnly}
            value={localTags}
            placeholder={tagPlaceholder}
            onChange={this.handleChange}
            onAddItem={this.addItem}
          />
        </Grid.Row>
        <Grid.Row>
          <Button primary disabled={!changed} onClick={this.handleSave}>
            <FormattedMessage
              id="app.program_tags.save"
              description="Button label to save program tags"
              defaultMessage="Save"
            />
          </Button>
        </Grid.Row>
      </Grid>
    );
  }
}

ProgramTags.defaultProps = {
  tag: {
    tags: [],
  },
};

ProgramTags.propTypes = {
  code: PropTypes.shape({
    id: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    isReadOnly: PropTypes.bool,
  }).isRequired,
  tag: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }),
  intl: intlShape.isRequired,
  changeProgramTags: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
};

export default hot(module)(
  withCookies(
    injectIntl(
      connect(mapStateToProps, mapDispatchToProps)(ProgramTags),
    ),
  ),
);
