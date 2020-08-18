import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { changeReadOnly as actionChangeReadOnly, clearProgram } from '../actions/code';
import { clearPrograms, fetchPrograms, removeProgram } from '../actions/program';
import { checkAuthError, authHeader } from '../actions/auth';
import { fetchTags } from '../actions/tag';
import { fetchUserStats } from '../actions/user';
import ProgramList from '../components/ProgramList';

const mapStateToProps = ({
  code, program, tag, user,
}) => ({
  code, ...program, tag, user,
});
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchPrograms: (params) => {
    const xhrOptions = authHeader(cookies);

    xhrOptions.params = params;

    return dispatch(fetchPrograms(xhrOptions)).catch(checkAuthError(dispatch));
  },
  removeProgram: (id) => dispatch(removeProgram(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  changeReadOnly: (isReadOnly) => dispatch(actionChangeReadOnly(isReadOnly)),
  fetchTags: () => dispatch(fetchTags(authHeader(cookies))).catch(checkAuthError(dispatch)),
  clearProgram: () => dispatch(clearProgram()),
  clearProgramList: () => dispatch(clearPrograms()),
  fetchUserStats: (id) => dispatch(fetchUserStats(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
});

const ProgramListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgramList);

ProgramListContainer.defaultProps = {
  owned: false,
};

ProgramListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  owned: PropTypes.bool,
};

export default hot(module)(withCookies(ProgramListContainer));
