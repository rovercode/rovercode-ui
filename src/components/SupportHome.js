import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withCookies, Cookies } from 'react-cookie';
import { Header, Button } from 'semantic-ui-react';
import { fetchProgram as actionfetchProgram } from '@/actions/code';
import PropTypes from 'prop-types';
import {
    fetchSupportRequests as actionfetchSupportRequests,
    rowClicked as actionRowClicked,
} from '../actions/supporthome';
import {
    setSessionID as actionSetSessionId,
    setClientID as actionSetClientId,
    setIsSupportProvider as actionSetIsSupportProvider,

} from '../actions/chatapp';

const mapStateToProps = ({ supporthome, chatapp }) => ({ supporthome, chatapp });
const mapDispatchToProps = (dispatch, { cookies }) => ({
    fetchsupportrequests: (headers, excludeInProgress) => dispatch(actionfetchSupportRequests(headers, excludeInProgress)),
    fetchprogram: (programId, headers) => dispatch(actionfetchProgram(programId, headers)),
    rowClicked: rowobject => dispatch(actionRowClicked(rowobject)),
    setSessionId: id => dispatch(actionSetSessionId(id)),
    setIsSupportProvider: () => dispatch(actionSetIsSupportProvider()),
    setClientId: id => dispatch(actionSetClientId(id)),
});

const columns = [{
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
},  {
    Header: 'Creation Time',
    accessor: 'creation_time', // String-based value accessors!
},];


class SupportHome extends React.Component {
    componentDidMount() {
        const { cookies } = this.props;
        const { fetchsupportrequests } = this.props;
        // const jwt = cookies.get('auth_jwt');
        const headers = {
            Authorization: `JWT ${cookies.get('auth_jwt')}`,
        };
        fetchsupportrequests(headers, true);
    }

    onButtonClick = () => {
        // this.toggleInProgressState(rowInfo);
    }

    setIsSupportProvider = () => {
        const { setIsSupportProvider } = this.props;
        setIsSupportProvider();
    }

    setSessionId = (id) => {
        const { setSessionId } = this.props;
        setSessionId(id);
    }

    rowClicked = (rowinfo) => {
        const { rowClicked } = this.props;
        rowClicked(rowinfo);
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
                        <div>
                            <ReactTable
                                columns={columns}
                                defaultSorted={[{
                                    id: 'id',
                                    desc: true,
                                }]}
                                data={json}
                                getTdProps={(state, rowInfo) => {
                                    if (typeof rowInfo !== 'undefined') {
                                        return {
                                            onClick: (e) => {
                                                this.rowClicked(rowInfo.original);
                                                this.setIsSupportProvider();
                                                this.setSessionId(rowInfo.original.id);
                                                const headers = {
                                                    headers: {
                                                        Authorization: `JWT ${this.props.cookies.get('auth_jwt')}`,
                                                    },
                                                };
                                                this.props.fetchprogram(rowInfo.original.program, headers);
                                            },
                                            style: {
                                                background: rowInfo.original.id === this.props.supporthome.rowInfo.id ? '#00afec' : 'white',
                                                color: rowInfo.original.id === this.props.supporthome.rowInfo.id ? 'white' : 'black',
                                            },
                                        };
                                    }

                                    return {
                                        style: {
                                            background: 'white',
                                            color: 'black',
                                        },
                                    };
                                }}
                            />
                            <br />
                            <br />
                            {this.props.supporthome.rowInfo.id !== null ?
                                <Link to="/mission-control">
                                    <Button positive onClick={this.onButtonClick}>
                                        Provide Support
              </Button>
                                </Link> :
                                <Button positive disabled>
                                    Provide Support
            </Button>
                            }

                        </div>
                    )
                }
            </div>
        );
    }
}

SupportHome.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    fetchsupportrequests: PropTypes.func.isRequired,
    fetchprogram: PropTypes.func.isRequired,
    rowClicked: PropTypes.func.isRequired,
    setSessionId: PropTypes.func.isRequired,
    setIsSupportProvider: PropTypes.func.isRequired,
    json: PropTypes.string.isRequired,

};
export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(SupportHome)));
