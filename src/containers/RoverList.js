import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import {
  fetchRoversRequest,
  fetchRoversSuccess,
  fetchRoversFailure,
} from '../actions/rover';
import RoversList from '../components/rovers/index';

const mapStateToProps = state => ({
  rovers: state.rovers,
});

const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchRovers() {
    dispatch(fetchRoversRequest());
    return axios.get('/api/v1/rovers/', {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    }).then(response => dispatch(fetchRoversSuccess(), response.data))
      .catch(() => dispatch(fetchRoversFailure()));
  },
});

const RoverListContainer = connect(mapStateToProps, mapDispatchToProps)(RoversList);

RoverListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(RoverListContainer));
