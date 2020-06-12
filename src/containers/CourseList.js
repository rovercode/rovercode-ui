import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { fetchCourses } from '../actions/curriculum';
import { checkAuthError, authHeader } from '../actions/auth';
import CourseList from '../components/CourseList';

const mapStateToProps = ({ curriculum, user }) => ({ ...curriculum, user });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchCourses: (params) => {
    const xhrOptions = authHeader(cookies);

    xhrOptions.params = params;

    return dispatch(fetchCourses(xhrOptions)).catch(checkAuthError(dispatch));
  },
});

const CourseListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseList);

CourseListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(CourseListContainer));
