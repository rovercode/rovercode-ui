import React from 'react'
import { Button, Card, Select } from 'semantic-ui-react'
import {selectChange as actionSelectChange} from '../actions/chatform'
import { hot } from 'react-hot-loader';
import {connect} from 'react-redux'



const mapStateToProps = ({ chatform }) => ({ chatform });
const mapDispatchToProps = dispatch => ({
  selectchange: () => dispatch(actionSelectChange()),
});


const helpOptions = [
    {
      key:'logic',
      value: 'Logic issues',
      text: 'Logic Issues'
    }, 
    {
      key:'stuck',
      value: "I'm stuck!",
      text: "I'm stuck!"
    },
    {
      key:'other',
      value: "Other",
      text: 'Other'
    }
  ];

class ChatForm extends React.Component {

    constructor(props){
        super(props);
    }

    selectChange = () =>{
        const {selectchange} = this.props;
        selectchange();
    }

    render(){
        return(
            <div><Card.Header>Need help?</Card.Header>
              <label>Select the issue you are having</label>
              <Select placeholder='Example: Logic Issues'options={helpOptions} onChange={this.selectChange} value={this.props.chatform.selectValue}/>
              <br />
              <br />
              <Button className="ui primary button" onClick={this.props.toggleForms}>Submit</Button>
            </div>
        )
    }

}

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ChatForm));
