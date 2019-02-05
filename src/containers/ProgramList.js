import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { fetchProgram } from '../actions/code';
import { fetchPrograms } from '../actions/program';
import { updateValidAuth } from '../actions/auth';
import ProgramList from '../components/ProgramList';

const mapStateToProps = ({ program }) => ({ ...program });
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
  fetchPrograms: () => {
    const fetchProgramsAction = fetchPrograms({
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchProgramsAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        dispatch(updateValidAuth(false));
      }
    });
  },
});

const ProgramListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgramList);

ProgramListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(ProgramListContainer));
