import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withCookies, Cookies } from 'react-cookie';
import { Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  fetchSupportRequests as actionfetchSupportRequests,
  // rowClicked as actionRowClicked,
} from '../actions/supporthome';


const mapStateToProps = ({ supporthome }) => ({ supporthome });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchsupportrequests: headers => dispatch(actionfetchSupportRequests(headers)),
  // rowClicked: rowobject => dispatch(actionRowClicked())
});

const columns = [{
  Header: 'Support Request ID',
  accessor: 'id', // String-based value accessors!
}, {
  Header: 'Subject',
  accessor: 'subject', // String-based value accessors!
}, {
  Header: 'More Info',
  accessor: 'body', // String-based value accessors!
}, {
  Header: 'Experience Level',
  accessor: 'experience_level', // String-based value accessors!
}, {
  Header: 'Category',
  accessor: 'category', // String-based value accessors!
}, {
  Header: 'Creation Time',
  accessor: 'creation_time', // String-based value accessors!
}, {
  Header: 'In Progress?',
  accessor: 'in_progress', // String-based value accessors!
}, {
  Header: 'Owner ID',
  accessor: 'owner', // String-based value accessors!
},
];


class SupportHome extends React.Component {
  componentDidMount() {
    const { cookies } = this.props;
    const { fetchsupportrequests } = this.props;
    const headers = {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    };
    fetchsupportrequests(headers);
  }

  render() {
    const { json } = this.props.supporthome;
    return (
      <div>
        <center>
          <Header as="h1">
                Support Requests
          </Header>
        </center>
        <br />
        <br />
        {json === null ? (
          <h1>
            No data
          </h1>
        ) : (
          <ReactTable
            columns={columns}
            data={json}
            getTdProps={(state, rowInfo) => ({
              onClick: (e) => {
                console.log('It was in this row:', rowInfo);
              },
            })}
          />
        )
            }
      </div>
    );
  }
}

SupportHome.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  fetchsupportrequests: PropTypes.func.isRequired,
  json: PropTypes.string.isRequired,

};
export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(SupportHome)));
