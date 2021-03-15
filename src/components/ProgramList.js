import React, { Component } from 'react';
import { Box, CircularProgress, Grid } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import ConfirmDialog from './ConfirmDialog';
import Footer from './Footer';
import ProgramCollection from './ProgramCollection';

const defaultState = {
  programSelected: null,
  confirmOpen: false,
  focusProgram: {
    id: null,
    name: null,
  },
};

class ProgramList extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount() {
    const { clearProgram, clearProgramList } = this.props;

    clearProgramList();
    clearProgram();

    return this.fetch();
  }

  fetch = () => {
    const {
      fetchPrograms, fetchTags, fetchUserStats, owned, user,
    } = this.props;

    fetchTags();
    fetchUserStats(user.user_id);

    return owned
      ? fetchPrograms({
        user: user.user_id,
      })
      : fetchPrograms({
        user__not: user.user_id,
      });
  };

  showConfirm = (e) => this.setState({
    confirmOpen: true,
    focusProgram: {
      id: e.target.parentNode.id || e.target.id,
      name: e.target.parentNode.name || e.target.name,
    },
  });

  cancelRemove = () => this.setState(defaultState);

  removeProgram = () => {
    const { removeProgram } = this.props;
    const { focusProgram } = this.state;

    this.setState(defaultState);

    return removeProgram(focusProgram.id).then(this.fetch);
  };

  selectProgram = (e) => {
    let program = e.target;
    if (e.target.parentNode.parentNode.id) {
      program = e.target.parentNode.parentNode;
    }

    this.setState({
      programSelected: program.id,
    });
  };

  fetchUserPrograms = (params) => {
    const { fetchPrograms, user } = this.props;

    fetchPrograms({
      user: user.user_id,
      ...params,
    });
  };

  fetchCommunityPrograms = (params) => {
    const { fetchPrograms, user } = this.props;
    fetchPrograms({
      user__not: user.user_id,
      ...params,
    });
  };

  render() {
    const {
      intl, owned, programs, user, tag,
    } = this.props;
    const { confirmOpen, focusProgram, programSelected } = this.state;

    const myProgramsHeader = intl.formatMessage({
      id: 'app.program_list.my_programs',
      description: "Header for all of user's programs",
      defaultMessage: 'My Programs',
    });

    const communityProgramsHeader = intl.formatMessage({
      id: 'app.program_list.community_programs',
      description: 'Header for all community programs',
      defaultMessage: 'Community Programs',
    });

    const cancelButtonText = intl.formatMessage({
      id: 'app.program_list.cancel',
      description: 'Button label to cancel removing program',
      defaultMessage: "No, don't remove program",
    });

    const confirmButtonText = intl.formatMessage({
      id: 'app.program_list.confirm',
      description: 'Button label to confirm removing program',
      defaultMessage: 'Yes, remove program',
    });

    const dialogHeader = intl.formatMessage({
      id: 'app.program_list.dialog_header',
      description: 'Header for removing program confirmation dialog',
      defaultMessage: 'Remove Program',
    });

    const dialogContent = intl.formatMessage(
      {
        id: 'app.program_list.dialog_content',
        description: 'Asks the user to confirm removing program',
        defaultMessage: 'Are you sure you want to remove {name}?',
      },
      {
        name: focusProgram.name,
      },
    );

    return (
      <>
        {programSelected ? (
          <Redirect
            to={{
              pathname: `/mission-control/${programSelected}`,
            }}
          />
        ) : null}
        <Grid container direction="column">
          {programs === null ? (
            <Grid item>
              <CircularProgress />
            </Grid>
          ) : (
            <Grid item>
              <Box>
                <ProgramCollection
                  programs={programs}
                  user={user}
                  tag={tag}
                  label={owned ? myProgramsHeader : communityProgramsHeader}
                  onProgramClick={this.selectProgram}
                  onRemoveClick={this.showConfirm}
                  onUpdate={owned ? this.fetchUserPrograms : this.fetchCommunityPrograms}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        <ConfirmDialog
          title={dialogHeader}
          open={confirmOpen}
          onConfirm={this.removeProgram}
          onCancel={this.cancelRemove}
          cancelButton={cancelButtonText}
          confirmButton={confirmButtonText}
        >
          {dialogContent}
        </ConfirmDialog>
        <Footer />
      </>
    );
  }
}

ProgramList.defaultProps = {
  programs: {
    next: null,
    previous: null,
    total_pages: 1,
    results: [],
  },
  tag: {
    tags: [],
  },
};

ProgramList.propTypes = {
  fetchPrograms: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
  removeProgram: PropTypes.func.isRequired,
  clearProgramList: PropTypes.func.isRequired,
  clearProgram: PropTypes.func.isRequired,
  fetchUserStats: PropTypes.func.isRequired,
  owned: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  programs: PropTypes.shape({
    next: PropTypes.string,
    previous: PropTypes.string,
    total_pages: PropTypes.number,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }).isRequired,
      }),
    ),
  }),
  tag: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(ProgramList);
