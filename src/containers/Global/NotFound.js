import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';

import notFoundImage from '@/assets/images/404.png';

const NotFound = () => (
  <Grid centered>
    <Grid.Row>
      <Image src={notFoundImage} />
    </Grid.Row>
    <Grid.Row>
      <Header size="huge">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </Header>
    </Grid.Row>
  </Grid>
);

export default NotFound;
