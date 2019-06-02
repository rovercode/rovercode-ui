import React from 'react';
import { Icon, Pagination } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';

const CustomPagination = props => (
  <Pagination
    {...props}
    ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
    firstItem={{ content: <Icon name="angle double left" />, icon: true }}
    lastItem={{ content: <Icon name="angle double right" />, icon: true }}
    prevItem={{ content: <Icon name="angle left" />, icon: true }}
    nextItem={{ content: <Icon name="angle right" />, icon: true }}
  />
);

export default hot(module)(CustomPagination);
