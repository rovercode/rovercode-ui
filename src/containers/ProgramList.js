import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { changeReadOnly as actionChangeReadOnly, fetchProgram } from '../actions/code';
import { fetchPrograms, removeProgram } from '../actions/program';
import { checkAuthError, authHeader } from '../actions/auth';
import { fetchTags } from '../actions/tag';
import ProgramList from '../components/ProgramList';

const mapStateToProps = ({
  code, program, tag, user,
}) => ({
  code, ...program, tag, user,
});
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchProgram: id => dispatch(fetchProgram(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  fetchPrograms: (params) => {
    const xhrOptions = authHeader(cookies);

    xhrOptions.params = params;

    return dispatch(fetchPrograms(xhrOptions)).catch(checkAuthError(dispatch));
  },
  removeProgram: id => dispatch(removeProgram(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  changeReadOnly: isReadOnly => dispatch(actionChangeReadOnly(isReadOnly)),
  fetchTags: () => dispatch(fetchTags(authHeader(cookies))).catch(checkAuthError(dispatch)),
});

const ProgramListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgramList);

ProgramListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(ProgramListContainer));
