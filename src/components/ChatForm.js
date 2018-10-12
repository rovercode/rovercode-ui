import React from 'react'
import { Button, Card, Select } from 'semantic-ui-react'

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


export default class ChatAForm extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            selectvalue: "select"
        }
    }

    selectChange = () =>{
        this.setState({selectValue:event.target.value})
    }

    render(){
        return(
            <div><Card.Header>Need help?</Card.Header>
              <label>Select the issue you are having</label>
              <Select placeholder='Example: Logic Issues'options={helpOptions} onChange={this.selectChange} value={this.state.selectValue}/>
              <br />
              <br />
              <Button className="ui primary button" onClick={this.props.toggleForms}>Submit</Button>
            </div>
        )
    }

}