import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import {
  ArrowDownward,
  ArrowUpward,
  Search,
} from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Course from './Course';
import Footer from './Footer';

const styles = (theme) => ({
  mainContainer: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.up('xs')]: {
      minWidth: theme.breakpoints.values.xs,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: theme.breakpoints.values.sm,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: theme.breakpoints.values.md,
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: theme.breakpoints.values.lg,
    },
  },
  listContainer: {
    marginTop: theme.spacing(2),
  },
  paginationPaddedBox: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
});

class CourseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      searchQuery: null,
      ordering: 'name',
      sortMenuAnchorElement: null,
      programSelected: null,
    };
  }

  componentDidMount() {
    const { fetchCourses } = this.props;

    return fetchCourses();
  }

  update = () => {
    const { fetchCourses } = this.props;
    const {
      page,
      ordering,
      searchQuery,
    } = this.state;

    const params = {
      page,
      ordering,
    };

    if (searchQuery) {
      params.search = searchQuery;
    }

    fetchCourses(params);
  }

  selectProgram = (e) => {
    let program = e.target.parentNode;
    if (e.target.parentNode.parentNode.parentNode.id) {
      program = e.target.parentNode.parentNode.parentNode;
    } else if (e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id) {
      program = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    }

    this.setState({
      programSelected: program.id,
    });
  }

  toggleOrdering = (name) => {
    const { ordering } = this.state;

    if (ordering.endsWith(name)) {
      if (ordering.startsWith('-')) {
        return ordering.substr(1);
      }

      return `-${ordering}`;
    }

    return name;
  }

  handleSortClick = (event) => this.setState({
    sortMenuAnchorElement: event.currentTarget,
  })

  handleSortClose = () => this.setState({
    sortMenuAnchorElement: null,
  })

  handlePageChange = (e, page) => this.setState({
    page,
  }, () => this.update())

  handleSearchChange = (event) => this.setState({
    searchQuery: event.target.value,
    page: 1,
  }, () => this.update())

  handleOrderingChange = (e) => this.setState({
    ordering: this.toggleOrdering(e.target.id),
  }, () => this.update())

  render() {
    const {
      classes,
      intl,
      courses,
    } = this.props;
    const {
      ordering,
      programSelected,
      sortMenuAnchorElement,
    } = this.state;

    const searchPlaceholder = intl.formatMessage({
      id: 'app.course_list.search',
      description: 'Placeholder for search entry',
      defaultMessage: 'Search courses',
    });

    const title = intl.formatMessage({
      id: 'app.course_list.title',
      description: 'Header for all courses',
      defaultMessage: 'Courses',
    });

    const Title = withStyles(() => ({
      root: {
        fontWeight: 'bold',
      },
    }))(Typography);

    const TitleArea = withStyles((theme) => ({
      root: {
        marginBottom: theme.spacing(4),
      },
    }))(Grid);

    return (
      <>
        <Container className={classes.mainContainer}>
          <TitleArea item container direction="row" justify="space-between">
            <Grid item>
              <Title variant="h4">
                { title }
              </Title>
            </Grid>
          </TitleArea>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                size="small"
                className="prompt"
                icon="search"
                placeholder={searchPlaceholder}
                onChange={this.handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <Grid container justify="flex-end" spacing={2}>
                <Grid item>
                  <Button aria-controls="sort-menu" aria-haspopup="true" onClick={this.handleSortClick}>
                    <FormattedMessage
                      id="app.program_collection.sort"
                      description="Button label for sort options"
                      defaultMessage="Sort"
                    />
                  </Button>
                  <Menu
                    id="sort-menu"
                    anchorEl={sortMenuAnchorElement}
                    keepMounted
                    open={Boolean(sortMenuAnchorElement)}
                    onClose={this.handleSortClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <MenuItem onClick={this.handleOrderingChange} id="name">
                      <FormattedMessage
                        id="app.program_collection.name"
                        description="Button label to sort by name"
                        defaultMessage="Name"
                      />
                      {
                      ordering === 'name' ? (
                        <>
                          <ArrowDownward />
                        </>
                      ) : (
                        <>
                          <ArrowUpward />
                        </>
                      )
                    }
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="column" justify="center" alignItems="stretch">
            {
              courses === null ? (
                <Grid item container direction="row" justify="center">
                  <CircularProgress />
                </Grid>
              ) : (null)
            }
            {
              courses && courses.count === 0 ? (
                <Grid item container direction="row" alignItems="center" justify="center">
                  <Typography variant="h4">
                    <FormattedMessage
                      id="app.course_list.nothing"
                      description="Informs the user that no courses match the filters"
                      defaultMessage="Sorry, no courses match your filters."
                    />
                  </Typography>
                </Grid>
              ) : (
                <Grid item>
                  <Box
                    className={classes.listContainer}
                  >
                    {
                      courses ? courses.results.map((course) => (
                        <Course
                          key={course.id}
                          course={course}
                          onLessonClick={this.selectProgram}
                        />
                      )) : (null)
                    }
                  </Box>
                </Grid>
              )
            }
          </Grid>
          {
          courses && courses.total_pages > 1 ? (
            <Box
              className={classes.paginationPaddedBox}
            >
              <Pagination
                defaultPage={1}
                count={courses.total_pages}
                showFirstButton
                showLastButton
                color="secondary"
                onChange={this.handlePageChange}
              />
            </Box>
          ) : (null)
        }
        </Container>
        <Divider />
        <Footer />
        {
          programSelected ? (
            <Redirect to={{
              pathname: `/mission-control/${programSelected}`,
            }}
            />
          ) : (null)
        }
      </>
    );
  }
}

CourseList.defaultProps = {
  courses: {
    next: null,
    previous: null,
    total_pages: 1,
    results: [],
  },
};

CourseList.propTypes = {
  classes: PropTypes.shape({
    mainContainer: PropTypes.string.isRequired,
    listContainer: PropTypes.string.isRequired,
    paginationPaddedBox: PropTypes.string.isRequired,
  }).isRequired,
  fetchCourses: PropTypes.func.isRequired,
  courses: PropTypes.shape({
    count: PropTypes.number,
    next: PropTypes.string,
    previous: PropTypes.string,
    total_pages: PropTypes.number,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        lessons: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          reference: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        })).isRequired,
      }),
    ),
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(injectIntl(withStyles(styles)(CourseList)));
