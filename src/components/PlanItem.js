import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const Banner = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    borderRadius: '4px 4px 0px 0px',
    maxWidth: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))(Typography);

const PlanItem = ({ active, children, title }) => (
  <>
    {
    active === true ? (
      <Banner variant="subtitle2" align="center">
        <FormattedMessage
          id="app.plan_item.your_plan"
          description="Identifier for the subscription plan"
          defaultMessage="Your plan"
        />
      </Banner>
    ) : (null)
  }
    <Box p={2} border={1} borderRadius="borderRadius" boxShadow={2} borderColor="grey.300">
      <Typography variant="h4" align="center">
        {title}
      </Typography>
      {children}
    </Box>
  </>
);

PlanItem.defaultProps = {
  active: false,
};

PlanItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default hot(module)(PlanItem);
