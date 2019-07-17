import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import notFoundImage from '@/assets/images/404.png';

const NotFound = () => (
  <Grid centered>
    <Grid.Row>
      <Image src={notFoundImage} />
    </Grid.Row>
    <Grid.Row>
      <Header size="huge">
        <FormattedMessage
          id="app.global.not_exist"
          description="Notifies the user that the page does not exist"
          defaultMessage="Sorry, the page you're looking for doesn't exist."
        />
      </Header>
    </Grid.Row>
  </Grid>
);

export default NotFound;
