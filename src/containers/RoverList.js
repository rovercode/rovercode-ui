import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { fetchRovers } from '../actions/rover';
import RoverList from '../components/RoverList';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchRovers: () => {
    const fetchRoversAction = fetchRovers({
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchRoversAction);
  },
});

const RoverListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoverList);

RoverListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(RoverListContainer));
