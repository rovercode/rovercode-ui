import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { updateJsCode as actionUpdateJsCode } from '@/actions/code';
import Workspace from '@/components/Workspace';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = dispatch => ({
  updateJsCode: jsCode => dispatch(actionUpdateJsCode(jsCode)),
});

const MissionControl = ({ code, updateJsCode }) => (
  <Grid columns={16}>
    <Grid.Row>
      <Grid.Column width={8}>
        <Workspace updateJsCode={updateJsCode} />
      </Grid.Column>
      <Grid.Column width={8}>
        <Header>
          Javascript
        </Header>
        <pre>
          {code.jsCode}
        </pre>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

MissionControl.propTypes = {
  updateJsCode: PropTypes.func.isRequired,
  code: PropTypes.shape({
    jsCode: PropTypes.string,
  }).isRequired,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(MissionControl));
