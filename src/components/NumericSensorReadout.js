import React from 'react';
import { Typography, AccordionDetails } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  expansionPanelSubDetails: {
    color: theme.palette.text.secondary,
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(1),
  },
});

const NumericSensorReadout = ({
  title,
  readings,
  unit,
  classes,
}) => (
  <>
    <AccordionDetails>
      <Typography>
        {title}
      </Typography>
    </AccordionDetails>
    {
      readings.map((reading) => (
        <AccordionDetails key={reading.label} className={classes.expansionPanelSubDetails}>
          <Typography variant="body2">
            {
              reading.reading === null ? (
                `${reading.label}: ? / ${reading.maxReading} ${unit}`
              ) : (
                `${reading.label}: ${reading.reading} / ${reading.maxReading} ${unit}`
              )
            }
          </Typography>
        </AccordionDetails>
      ))
    }
  </>
);

NumericSensorReadout.defaultProps = {
  unit: null,
};

NumericSensorReadout.propTypes = {
  classes: PropTypes.shape({
    expansionPanelSubDetails: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  readings: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    reading: PropTypes.number,
    maxReading: PropTypes.number.isRequired,
  })).isRequired,
  unit: PropTypes.string,
};

export default hot(module)(withStyles(styles)(NumericSensorReadout));
