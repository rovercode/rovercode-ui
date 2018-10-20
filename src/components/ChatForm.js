import React from 'react';
import axios from 'axios';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Button, Card, Dropdown, Input } from 'semantic-ui-react';
import { categorySelectChange as actionCategorySelectChange, 
  bodyInputChange as actionBodyInputChange, 
  subjectInputChange as actionSubjectInputChange, 
  experienceSelectChange as actionExperienceSelectChange,
  WHAT_NEXT, FUN_IDEAS, DEBUG, 
  EXPERT, PRETTY_NEW, FIRST_TIME,FOR_A_WHILE } 
  from '../actions/chatform';



const mapStateToProps = ({ chatform }) => ({ chatform });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  categoryselectchange: state => dispatch(actionCategorySelectChange(state)),
  bodyinputchange: state=>dispatch(actionBodyInputChange(state)),
  subjectinputchange: state=>dispatch(actionSubjectInputChange(state)),
  experienceselectchange: state => dispatch(actionExperienceSelectChange(state)),
});


const helpCategories = [
    {
      value: DEBUG,
      text: "My code isn't doing what I think it should",
    }, 
    {
      value: WHAT_NEXT,
      text: "I don't know what to do next"
    },
    {
      value: FUN_IDEAS,
      text: "I'm looking for fun ideas"
    }
  ];
  const experience = [
    {
      value: FIRST_TIME,
      text: "This is my first time on Rovercode"
    }, 
    {
      value: PRETTY_NEW,
      text: "I'm pretty new to Rovercode"
    }, 
    {
      value: FOR_A_WHILE,
      text: "I've used Rovercode for a while"
    }, 
    {
      value: EXPERT,
      text: "I'm a Rovercode expert"
    },
  ];

class ChatForm extends React.Component {

    constructor(props){
        super(props);
    }

    //action creators
    categorySelectChange = (event, data) =>{
      const payload = data.value;
      const {categoryselectchange} = this.props;
      console.log(payload)
      categoryselectchange(payload);
    }

    subjectInputChange = (event, data) =>{
      const payload = data.value;
      const {subjectinputchange} = this.props;
      console.log(payload)
      subjectinputchange(payload);
    }

    bodyInputChange = (event, data) =>{
      const payload = data.value;
      const {bodyinputchange} = this.props;
      console.log(payload)
      bodyinputchange(payload);
    }

    experienceSelectChange = (event, data) =>{
      const payload = data.value;
      const {experienceselectchange} = this.props;
      console.log(payload)
      experienceselectchange(payload);
    }

    validateForm = () =>{
      if (this.props.chatform.experienceValue !== "" &&
          this.props.chatform.subjectValue !== "" && 
          this.props.chatform.bodyValue !== ""){
            this.postData(
              {
                "subject": this.props.chatform.subjectValue,
                "body": this.props.chatform.bodyValue,
                "experience_level": this.props.chatform.experienceValue,
                "category": this.props.chatform.categoryValue,
                "in_progress": false,
              }
            );
      }else{
        alert("Please complete the entire form before submitting");
      }
        
    }

    postData = (data) => {
      const { cookies } = this.props;
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookies.get('auth_jwt')}`
      }
      return axios.post('/api/v1/support-requests/', data, {headers:headers})
        .then(() => {
          this.props.toggleForms();
        })
        .catch(() => {
            alert("Error: unable to reach server with help request. Please try again later. ")
        });
    }

    render(){
        return(
            <div>
              <Card.Header><b>Need help?</b></Card.Header><br />
              <label>Select the issue you are having</label>
              <Dropdown placeholder='Example: Logic Issues' fluid selection options={helpCategories} onChange={this.categorySelectChange} value={this.props.chatform.categoryValue}/>
              <br />
              <label>Select your experience level</label>
              <Dropdown placeholder='Example: Beginner' fluid selection options={experience} onChange={this.experienceSelectChange} value={this.props.chatform.experienceValue}/>
              <br />
              <label>Subject</label>
                <Input fluid id="subject" placeholder="Describe your issue" onChange={this.subjectInputChange}/>
              <br />
              <br />
              <label>More information</label>
                <Input fluid id="body" placeholder="Provide any additional details" onChange={this.bodyInputChange}/>
              <br />
              <br />
              <Button className="ui primary button" onClick={this.validateForm}>Submit</Button>
            </div>
        )
    }
}

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ChatForm)));
