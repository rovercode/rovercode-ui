import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { withCookies, Cookies } from 'react-cookie';
import {
  Button, Card, Dropdown, Input,
} from 'semantic-ui-react';
import {
  categorySelectChange as actionCategorySelectChange,
  bodyInputChange as actionBodyInputChange,
  subjectInputChange as actionSubjectInputChange,
  experienceSelectChange as actionExperienceSelectChange,
  WHAT_NEXT, FUN_IDEAS, DEBUG,
  EXPERT, PRETTY_NEW, FIRST_TIME, FOR_A_WHILE,
} from '../actions/chatform';

const mapStateToProps = ({ chatform, code }) => ({ chatform, code });
const mapDispatchToProps = dispatch => ({
  categorySelectChange: state => dispatch(actionCategorySelectChange(state)),
  bodyInputChange: state => dispatch(actionBodyInputChange(state)),
  subjectInputChange: state => dispatch(actionSubjectInputChange(state)),
  experienceSelectChange: state => dispatch(actionExperienceSelectChange(state)),
});

const helpCategories = [
  {
    value: DEBUG,
    text: "My code isn't doing what I think it should",
  },
  {
    value: WHAT_NEXT,
    text: "I don't know what to do next",
  },
  {
    value: FUN_IDEAS,
    text: "I'm looking for fun ideas",
  },
];

const experience = [
  {
    value: FIRST_TIME,
    text: 'This is my first time on Rovercode',
  },
  {
    value: PRETTY_NEW,
    text: "I'm pretty new to Rovercode",
  },
  {
    value: FOR_A_WHILE,
    text: "I've used Rovercode for a while",
  },
  {
    value: EXPERT,
    text: "I'm a Rovercode expert",
  },
];

class ChatForm extends React.Component {
    // action creators

    componentDidMount = () =>{
      if (this.props.supportProvider){
        this.props.toggleForms();
      }
    }
    categorySelectChange = (event, data) => {
      const payload = data.value;
      const { categorySelectChange } = this.props;
      categorySelectChange(payload);
    };

    subjectInputChange = (event, data) => {
      const payload = data.value;
      const { subjectInputChange } = this.props;
      subjectInputChange(payload);
    };

    bodyInputChange = (event, data) => {
      const payload = data.value;
      const { bodyInputChange } = this.props;
      bodyInputChange(payload);
    };

    experienceSelectChange = (event, data) => {
      const payload = data.value;
      const { experienceSelectChange } = this.props;
      experienceSelectChange(payload);
    };

    validateForm = (experienceValue, categoryValue, subjectValue, bodyValue, program) => {
      if (experienceValue !== ''
          && subjectValue !== ''
          && bodyValue !== '') {
        this.postData(
          {
            subject: subjectValue,
            body: bodyValue,
            experience_level: experienceValue,
            category: categoryValue,
            in_progress: false,
            program,
          },
        );
      } else {
        alert('Please complete the entire form before submitting');
      }
    };

    postData = (data) => {
      const { cookies, toggleForms } = this.props;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      };
      axios.post('/api/v1/support-requests/', data, { headers })
        .then((response) => {
          const { id } = response.data;
          const { setSessionId } = this.props;
          setSessionId(id);
          toggleForms();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    render() {
      const { chatform, code } = this.props;
      const {
        experienceValue, categoryValue, subjectValue, bodyValue,
      } = chatform;
      const { id: program } = code;
      return (
        <div>
          <Card.Header>
            <b>
              Need help?
            </b>
          </Card.Header>
          <br />
          <label htmlFor="category">
            What do you need?
            <Dropdown id="category" placeholder="" fluid selection options={helpCategories} onChange={this.categorySelectChange} value={categoryValue} />
          </label>
          <br />
          <label htmlFor="experience-level">
            How long have you been using Rovercode?
            <Dropdown id="experience-level" placeholder="" fluid selection options={experience} onChange={this.experienceSelectChange} value={experienceValue} />
          </label>
          <br />
          <label htmlFor="subject">
            Give a short description of your problem.
            <Input fluid id="subject" placeholder="..." onChange={this.subjectInputChange} />
          </label>
          <br />
          <br />
          <label htmlFor="body">
            Any other details?
            <Input fluid id="body" placeholder="..." onChange={this.bodyInputChange} />
          </label>
          <br />
          <br />
          <Button className="ui primary button" onClick={() => this.validateForm(experienceValue, categoryValue, subjectValue, bodyValue, program)}>
            Submit
          </Button>
        </div>
      );
    }
}

ChatForm.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  bodyInputChange: PropTypes.func.isRequired,
  categorySelectChange: PropTypes.func.isRequired,
  subjectInputChange: PropTypes.func.isRequired,
  experienceSelectChange: PropTypes.func.isRequired,
  toggleForms: PropTypes.func.isRequired,
  setSessionId: PropTypes.func.isRequired,
  chatform: PropTypes.shape({
    bodyValue: PropTypes.string.isRequired,
    experienceValue: PropTypes.number.isRequired,
    subjectValue: PropTypes.string.isRequired,
    categoryValue: PropTypes.string.isRequired,
  }).isRequired,
  code: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ChatForm)));
