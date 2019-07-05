import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { changeReadOnly as actionChangeReadOnly, fetchProgram } from '../actions/code';
import { fetchPrograms, removeProgram } from '../actions/program';
import { updateValidAuth } from '../actions/auth';
import ProgramList from '../components/ProgramList';

const mapStateToProps = ({ code, program, user }) => ({ code, ...program, user });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchProgram: (id) => {
    const fetchProgramAction = fetchProgram(id, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchProgramAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        dispatch(updateValidAuth(false));
      }
    });
  },
  fetchPrograms: (params) => {
    const xhrOptions = {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
      params,
    };

    const fetchProgramsAction = fetchPrograms(xhrOptions);
    return dispatch(fetchProgramsAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        dispatch(updateValidAuth(false));
      }
    });
  },
  removeProgram: (id) => {
    const removeProgramAction = removeProgram(id, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(removeProgramAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        dispatch(updateValidAuth(false));
      }
    });
  },
  changeReadOnly: isReadOnly => dispatch(actionChangeReadOnly(isReadOnly)),
});

const ProgramListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgramList);

ProgramListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(ProgramListContainer));
