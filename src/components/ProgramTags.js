import React, { Component } from 'react';
import { Chip, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies } from 'react-cookie';
import { injectIntl } from 'react-intl';
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
    };
  }

  componentDidMount() {
    const { code, fetchTags } = this.props;

    fetchTags();

    this.setState({
      localTags: code.tags,
    });
  }

  handleChange = (event, value) => {
    this.setState({
      localTags: value,
    }, () => this.handleSave());
  }

  handleSave = () => {
    const { changeProgramTags, code } = this.props;
    const { localTags } = this.state;

    changeProgramTags(code.id, localTags);
  }

  render() {
    const { code, tag, intl } = this.props;
    const { localTags } = this.state;

    const tagPlaceholder = intl.formatMessage({
      id: 'app.program_tags.placeholder',
      description: 'Placeholder for tags input',
      defaultMessage: 'Add tags...',
    });

    return (
      <Grid container direction="column" justify="center" alignItems="stretch" spacing={1}>
        <Grid item>
          <Autocomplete
            id="tag-select"
            multiple
            freeSolo
            filterSelectedOptions
            size="small"
            options={tag.tags.map((globalTag) => globalTag.name)}
            onChange={this.handleChange}
            value={localTags}
            disabled={code.isReadOnly}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={tagPlaceholder} />
            )}
            renderTags={(value, getTagProps) => value.map((option, index) => (
              <Chip color="secondary" size="small" label={option} {...getTagProps({ index })} />
            ))}
          />
        </Grid>
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
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
