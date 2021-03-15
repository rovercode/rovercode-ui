import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
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
  CardActionArea,
  CardActions,
  ListItemIcon,
  Link as MuiLink,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import {
  Add, ArrowDownward, ArrowUpward, Search, Delete,
} from '@material-ui/icons';
import SortIcon from '@material-ui/icons/Sort';
import { Pagination, Autocomplete } from '@material-ui/lab';
import { debounce } from 'throttle-debounce';

import flavourImage from '@/assets/images/flavour.png';

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
  paginationPaddedBox: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  flexitem1: {
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
  flexitem2: {
    order: 1,
    [theme.breakpoints.up('md')]: {
      order: 2,
    },
  },
  flexitem3: {
    justifyContent: 'flex-beginning',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
  flexitem4: {
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
  flexitem5: {
    order: 1,
    [theme.breakpoints.up('md')]: {
      order: 2,
    },
  },
});

class ProgramCollection extends Component {
  constructor(props) {
    super(props);

    this.searchDebounce = debounce(
      parseInt(SEARCH_DEBOUNCE_TIME, 10) || 1000,
      this.update, // eslint-disable-line no-undef
    );

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
      page, ordering, searchQuery, tagFilters,
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
  };

  toggleOrdering = (name) => {
    const { ordering } = this.state;

    if (ordering.endsWith(name)) {
      if (ordering.startsWith('-')) {
        return ordering.substr(1);
      }

      return `-${ordering}`;
    }

    return name;
  };

  handleSortClick = (event) => this.setState({
    sortMenuAnchorElement: event.currentTarget,
  });

  handleSortClose = () => this.setState({
    sortMenuAnchorElement: null,
  });

  handlePageChange = (e, page) => this.setState(
    {
      page,
    },
    this.update,
  );

  handleSearchChange = (event) => this.setState(
    {
      searchQuery: event.target.value,
      page: 1,
    },
    this.searchDebounce,
  );

  handleOrderingChange = (e) => this.setState(
    {
      ordering: this.toggleOrdering(e.target.id),
    },
    this.update,
  );

  handleTagFilterChange = (event, value) => this.setState(
    {
      tagFilters: value,
    },
    this.update,
  );

  render() {
    const {
      user, label, onProgramClick, onRemoveClick, programs, intl, tag, classes,
    } = this.props;
    const {
      ordering, searchQuery, sortMenuAnchorElement, tagFilters,
    } = this.state;

    const searchPlaceholder = intl.formatMessage({
      id: 'app.program_collection.search',
      description: 'Placeholder for search entry',
      defaultMessage: 'Search programs',
    });

    const tagFilterPlaceholder = intl.formatMessage({
      id: 'app.program_collection.filter',
      description: 'Placeholder for selecting tags used to filter',
      defaultMessage: 'Filter by tag',
    });

    const Title = withStyles(() => ({
      root: {
        fontWeight: 'bold',
      },
    }))(Typography);

    const DeleteButton = withStyles(() => ({
      root: {
        color: grey[500],
      },
    }))(Button);

    const FixedWidthAutocomplete = withStyles(() => ({
      root: {
        minWidth: '150px',
      },
    }))(Autocomplete);

    const TitleArea = withStyles((theme) => ({
      root: {
        marginBottom: theme.spacing(4),
      },
    }))(Grid);

    let programCount = -1;
    let programLimit = -1;
    if (user.stats && user.stats.block_diagram) {
      programCount = user.stats.block_diagram.count;
      programLimit = user.stats.block_diagram.limit;
    }

    return (
      <Container className={classes.mainContainer}>
        <TitleArea item container direction="row" justify="space-between">
          <Grid item>
            <Title variant="h1">{label}</Title>
          </Grid>
        </TitleArea>
        <Grid container spacing={2} style={{ marginBottom: '16px' }}>
          <Grid container item xs={12} md={8} spacing={2} className={classes.flexitem1}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                style={{ backgroundColor: 'white', fontWeight: '500' }}
                size="small"
                className="prompt"
                icon="search"
                placeholder={searchPlaceholder}
                onChange={this.handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Box marginRight={2} display="flex" alignItems="center">
              <Button
                variant="standard"
                style={{
                  color: '#7F7272',
                  fontWeight: '400',
                }}
                aria-controls="sort-menu"
                aria-haspopup="true"
                endIcon={<SortIcon />}
                onClick={this.handleSortClick}
              >
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
                  <ListItemIcon>
                    {ordering === 'name' ? (
                      <>
                        <ArrowDownward fontSize="small" />
                      </>
                    ) : (
                      <>
                        <ArrowUpward fontSize="small" />
                      </>
                    )}
                  </ListItemIcon>
                  <FormattedMessage
                    id="app.program_collection.name"
                    description="Button label to sort by name"
                    defaultMessage="Name"
                  />
                </MenuItem>
              </Menu>
            </Box>
            <Box>
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
                  <TextField
                    {...params}
                    variant="standard"
                    style={{ border: 'none' }}
                    label={tagFilterPlaceholder}
                  />
                )}
                renderTags={(value, getTagProps) => value.map((option, index) => (
                  <Chip
                    color="secondary"
                    size="small"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))}
              />
            </Box>
          </Grid>
          <Grid container item xs md spacing={2} className={classes.flexitem2}>
            <Grid item xs>
              <Box display="flex" alignItems="center" className={classes.flexitem3}>
                {user.tier === 1 && programCount >= 0 ? (
                  <Box
                    marginRight={2}
                    marginLeft={2}
                    style={{ width: '160px' }}
                    className={classes.flexitem4}
                  >
                    <Typography variant="subtitle2" display="inline">
                      <FormattedMessage
                        id="app.program_collection.slots"
                        description="Lists the number of free slots"
                        defaultMessage="Free Programs Used"
                      />
                      {': '}
                    </Typography>
                    <Typography variant="subtitle2" color="secondary" display="inline">
                      {`${programCount}/${programLimit}`}
                    </Typography>

                    {programCount >= programLimit ? (
                      <Typography variant="subtitle1">
                        <FormattedMessage
                          id="app.program_collection.over1"
                          description="Notifies the user of no remaining free slots"
                          defaultMessage="You have used all your free program slots. You can delete an existing program to free up a program slot, or you can"
                        />
                        {' '}
                        <MuiLink href="/user/settings">
                          <FormattedMessage
                            id="app.program_collection.over2"
                            description="Notifies the user of no remaining free slots"
                            defaultMessage="upgrade your account"
                          />
                        </MuiLink>
                        {' '}
                        <FormattedMessage
                          id="app.program_collection.over3"
                          description="Notifies the user of no remaining free slots"
                          defaultMessage="for unlimited programs."
                        />
                      </Typography>
                    ) : null}
                  </Box>
                ) : null}
                <Box className={classes.flexitem5}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Add />}
                    component={Link}
                    style={{ width: '162px' }}
                    to="/mission-control"
                    disabled={user.tier === 1 && programCount >= programLimit}
                  >
                    <FormattedMessage
                      id="app.program_collection.new"
                      description="Button label to create new program"
                      defaultMessage="New Program"
                    />
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {' '}
        </Grid>
        <Grid container spacing={2}>
          {programs.count === 0 && !searchQuery && tagFilters.length === 0 ? (
            <Grid item container direction="column" alignItems="center" justify="center">
              <Grid item>
                <img alt="Kids" width="300px" src={flavourImage} />
              </Grid>
              <Grid item>
                <Typography variant="h4">
                  <FormattedMessage
                    id="app.program_collection.no_programs"
                    description="Notifies new users he or she has no programs"
                    defaultMessage="You don't have any programs yet!"
                  />
                </Typography>
              </Grid>
            </Grid>
          ) : null}
          {programs.count === 0 && (searchQuery || tagFilters.length !== 0) ? (
            <Grid item container direction="row" alignItems="center" justify="center">
              <Typography variant="h4">
                <FormattedMessage
                  id="app.program_collection.nothing"
                  description="Informs the user that no programs match the filters"
                  defaultMessage="Sorry, no programs match your filters."
                />
              </Typography>
            </Grid>
          ) : (
            programs.results.map((program) => (
              <Grid item xs={12} md={6} lg={3} key={program.id}>
                <Card item variant="outlined" key={program.id}>
                  <CardActionArea
                    id={program.id}
                    data-owned={user.username === program.user.username}
                    onClick={onProgramClick}
                  >
                    <CardContent>
                      <Typography variant="h3">{program.name}</Typography>
                      {user.username === program.user.username ? null : (
                        <Typography variant="caption" color="textSecondary">
                          By
                          {' '}
                          {program.user.username}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                  {user.username === program.user.username ? (
                    <CardActions>
                      <DeleteButton
                        id={program.id}
                        name={program.name}
                        onClick={onRemoveClick}
                        size="small"
                        startIcon={<Delete />}
                      >
                        <FormattedMessage
                          id="app.program_collection.remove"
                          description="Button label to remove a program"
                          defaultMessage="Delete"
                        />
                      </DeleteButton>
                    </CardActions>
                  ) : null}
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        {programs.total_pages > 1 ? (
          <Box className={classes.paginationPaddedBox}>
            <Pagination
              defaultPage={1}
              count={programs.total_pages}
              showFirstButton
              showLastButton
              color="secondary"
              onChange={this.handlePageChange}
            />
          </Box>
        ) : null}
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
  classes: PropTypes.shape({
    mainContainer: PropTypes.string.isRequired,
    paginationPaddedBox: PropTypes.string.isRequired,
    flexitem1: PropTypes.string.isRequired,
    flexitem2: PropTypes.string.isRequired,
    flexitem3: PropTypes.string.isRequired,
    flexitem4: PropTypes.string.isRequired,
    flexitem5: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    tier: PropTypes.number.isRequired,
    stats: PropTypes.shape({
      block_diagram: PropTypes.shape({
        count: PropTypes.number,
        limit: PropTypes.number,
      }),
    }),
  }).isRequired,
  programs: PropTypes.shape({
    count: PropTypes.number,
    next: PropTypes.string,
    previous: PropTypes.string,
    total_pages: PropTypes.number,
    free_max: PropTypes.number,
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
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
  }),
  label: PropTypes.string.isRequired,
  onProgramClick: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(injectIntl(withStyles(styles)(ProgramCollection)));
