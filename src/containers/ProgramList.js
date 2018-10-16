import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { fetchPrograms } from '@/actions/program';
import { fetchProgram } from '@/actions/code';
import ProgramList from '@/components/ProgramList';

const mapStateToProps = ({ program }) => ({ ...program });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchPrograms: () => {
    const fetchProgramsAction = fetchPrograms({
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchProgramsAction);
  },
  fetchProgram: (id) => {
    const fetchProgramAction = fetchProgram(id, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchProgramAction);
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
