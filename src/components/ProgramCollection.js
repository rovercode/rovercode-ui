import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  CardActionArea,
  CardActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Search,
} from '@material-ui/icons';
import { Pagination, Autocomplete } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

class ProgramCollection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      searchQuery: null,
      ordering: 'name',
      tagFilters: [],
      sortMenuAnchorElement: null,
    };
  }

  update = () => {
    const { onUpdate } = this.props;
    const {
      page,
      ordering,
      searchQuery,
      tagFilters,
    } = this.state;

    const params = {
      page,
      ordering,
      tag: tagFilters.join(),
    };

    if (searchQuery) {
      params.search = searchQuery;
    }

    onUpdate(params);
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

  handleNameOrderingChange = () => this.setState({
    ordering: this.toggleOrdering('name'),
  }, () => this.update())

  handleTagFilterChange = (event, value) => this.setState({
    tagFilters: value,
  }, () => this.update())

  render() {
    const {
      user,
      label,
      onProgramClick,
      onRemoveClick,
      programs,
      intl,
      tag,
    } = this.props;
    const { ordering, tagFilters, sortMenuAnchorElement } = this.state;

    const searchPlaceholder = intl.formatMessage({
      id: 'app.program_collection.search',
      description: 'Placeholder for search entry',
      defaultMessage: 'Search...',
    });

    const tagFilterPlaceholder = intl.formatMessage({
      id: 'app.program_collection.filter',
      description: 'Placeholder for selecting tags used to filter',
      defaultMessage: 'Tag filters...',
    });

    const sortText = intl.formatMessage({
      id: 'app.program_collection.sort',
      description: 'Button label for sort options',
      defaultMessage: 'Sort',
    });

    const Title = withStyles(() => ({
      root: {
        fontWeight: 'bold',
      },
    }))(Typography);

    const FixedWidthAutocomplete = withStyles(() => ({
      root: {
        width: '100%',
      },
    }))(Autocomplete);

    const TitleArea = withStyles((theme) => ({
      root: {
        marginBottom: theme.spacing(4),
      },
    }))(Grid);

    const PaddedBox = withStyles((theme) => ({
      root: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
      },
    }))(Box);

    return (
      <Container maxWidth="lg">
        <TitleArea item container direction="row" justify="space-between">
          <Grid item>
            <Title variant="h4">
              {label}
            </Title>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Add />}
              component={Link}
              to="/mission-control"
            >
              <FormattedMessage
                id="app.program_list.new"
                description="Button label to create new program"
                defaultMessage="New Program"
              />
            </Button>
          </Grid>
        </TitleArea>
        <Grid container spacing={2}>
          <Grid item>
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
          <Grid item>
            <Button aria-controls="sort-menu" aria-haspopup="true" onClick={this.handleSortClick}>
              {sortText}
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
              <MenuItem onClick={this.handleNameOrderingChange}>
                <FormattedMessage
                  id="app.program_collection.name"
                  description="Button label to sort by name"
                  defaultMessage="Name"
                />
                {
                  ordering === 'name' ? (
                    <>
                      <ArrowDownward />
                      a ... z
                    </>
                  ) : (
                    <>
                      <ArrowUpward />
                      z ... a
                    </>
                  )
                }
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={2}>
            <FixedWidthAutocomplete
              id="tag-select"
              multiple
              freeSolo
              filterSelectedOptions
              size="small"
              options={tag.tags.map((t) => t.name)}
              onChange={this.handleTagFilterChange}
              value={tagFilters}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label={tagFilterPlaceholder} />
              )}
              renderTags={(value, getTagProps) => value.map((option, index) => (
                <Chip color="secondary" size="small" label={option} {...getTagProps({ index })} />
              ))}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {
            programs.results.map((program) => (
              <Grid item xs={12} md={6} lg={3}>
                <Card key={program.id}>
                  <CardHeader
                    title={program.name}
                    subheader={
                        user.username === program.user.username ? (
                          <FormattedMessage
                            id="app.program_collection.mine"
                            description="Label to indicate program owned by user"
                            defaultMessage="Mine"
                          />
                        ) : program.user.username
                      }
                  />
                  {/* <CardActionArea>
                    <CardContent>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </CardContent>
                  </CardActionArea> */}
                  <CardActions>
                    <Button
                      id={program.id}
                      data-owned={user.username === program.user.username}
                      onClick={onProgramClick}
                    >
                      {
                        user.username === program.user.username ? (
                          <FormattedMessage
                            id="app.program_collection.work"
                            description="Button label to keep working on program"
                            defaultMessage="Keep Working"
                          />
                        ) : (
                          <FormattedMessage
                            id="app.program_collection.view"
                            description="Button label to view a program"
                            defaultMessage="View"
                          />
                        )
                      }
                    </Button>
                    {
                      user.username === program.user.username ? (
                        <Button
                          id={program.id}
                          name={program.name}
                          onClick={onRemoveClick}
                          floated="right"
                        >
                          <FormattedMessage
                            id="app.program_collection.remove"
                            description="Button label to remove a program"
                            defaultMessage="Remove"
                          />
                        </Button>
                      ) : (null)
                    }
                  </CardActions>
                </Card>
              </Grid>
            ))
          }
        </Grid>
        {
          programs.total_pages > 1 ? (
            <PaddedBox
              display="flex"
              justifyContent="center"
            >
              <Pagination
                defaultPage={1}
                count={programs.total_pages}
                showFirstButton
                showLastButton
                color="secondary"
                onChange={this.handlePageChange}
              />
            </PaddedBox>
          ) : (null)
        }
      </Container>
    );
  }
}

ProgramCollection.defaultProps = {
  tag: {
    tags: [],
  },
};

ProgramCollection.propTypes = {
  user: PropTypes.shape({
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
  }).isRequired,
  tag: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }),
  label: PropTypes.string.isRequired,
  onProgramClick: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(injectIntl(ProgramCollection));
