import React, { useState } from 'react';
import './DynamicForm.css';
import { Form, Button, Col, Row } from 'react-bootstrap';

// Custom hook for form validation
const useFormValidation = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = '';

    if (name === 'fullName' && !value) error = 'Full Name is required';
    if (name === 'email' && (!value || !/\S+@\S+\.\S+/.test(value))) error = 'Valid email is required';
    if (name === 'phoneNumber' && (!value || !/^\d+$/.test(value))) error = 'Valid phone number is required';
    if ((name === 'relevantExperience' && (values.position === 'Developer' || values.position === 'Designer')) && (!value || value <= 0)) error = 'Relevant experience is required';
    if (name === 'portfolioURL' && values.position === 'Designer' && (!value || !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value))) error = 'Valid portfolio URL is required';
    if (name === 'managementExperience' && values.position === 'Manager' && !value) error = 'Management experience is required';
    if (name === 'additionalSkills' && !Object.values(values.additionalSkills).some(skill => skill)) error = 'At least one skill must be selected';
    if (name === 'preferredInterviewTime' && !value) error = 'Preferred interview time is required';

    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    setValues(prevValues => {
      const newValues = { ...prevValues, [name]: updatedValue };
      if (type === 'checkbox') {
        newValues.additionalSkills = { ...prevValues.additionalSkills, [value]: checked };
      }
      validate(name, updatedValue);
      return newValues;
    });
  };

  return { values, errors, handleChange };
};

const DynamicForm = () => {
  const initialState = {
    fullName: '',
    email: '',
    phoneNumber: '',
    position: '',
    relevantExperience: '',
    portfolioURL: '',
    managementExperience: '',
    additionalSkills: {},
    preferredInterviewTime: ''
  };

  const { values, errors, handleChange } = useFormValidation(initialState);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(error => error);
    const hasEmptyFields = Object.values(values).some(value => value === '');

    if (!hasErrors && !hasEmptyFields) {
      setSubmittedData(values);
    } else {
      alert('Please fill out all required fields correctly.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Job Application Form</h1>
      <Form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              isInvalid={!!errors.fullName}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              isInvalid={!!errors.phoneNumber}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="position">
            <Form.Label>Applying for Position</Form.Label>
            <Form.Control
              as="select"
              name="position"
              value={values.position}
              onChange={handleChange}
            >
              <option value="">Select Position</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
            </Form.Control>
          </Form.Group>
        </Row>

        {(values.position === 'Developer' || values.position === 'Designer') && (
          <Form.Group controlId="relevantExperience" className="mb-3">
            <Form.Label>Relevant Experience (Years)</Form.Label>
            <Form.Control
              type="number"
              name="relevantExperience"
              value={values.relevantExperience}
              onChange={handleChange}
              isInvalid={!!errors.relevantExperience}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.relevantExperience}</Form.Control.Feedback>
          </Form.Group>
        )}

        {values.position === 'Designer' && (
          <Form.Group controlId="portfolioURL" className="mb-3">
            <Form.Label>Portfolio URL</Form.Label>
            <Form.Control
              type="text"
              name="portfolioURL"
              value={values.portfolioURL}
              onChange={handleChange}
              isInvalid={!!errors.portfolioURL}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.portfolioURL}</Form.Control.Feedback>
          </Form.Group>
        )}

        {values.position === 'Manager' && (
          <Form.Group controlId="managementExperience" className="mb-3">
            <Form.Label>Management Experience</Form.Label>
            <Form.Control
              type="text"
              name="managementExperience"
              value={values.managementExperience}
              onChange={handleChange}
              isInvalid={!!errors.managementExperience}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.managementExperience}</Form.Control.Feedback>
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Additional Skills</Form.Label>
          <div>
            <Form.Check
              inline
              label="JavaScript"
              type="checkbox"
              id="skillJavaScript"
              name="additionalSkills"
              value="JavaScript"
              checked={values.additionalSkills.JavaScript || false}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="CSS"
              type="checkbox"
              id="skillCSS"
              name="additionalSkills"
              value="CSS"
              checked={values.additionalSkills.CSS || false}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Python"
              type="checkbox"
              id="skillPython"
              name="additionalSkills"
              value="Python"
              checked={values.additionalSkills.Python || false}
              onChange={handleChange}
            />
          </div>
          <Form.Control.Feedback type="invalid" className={errors.additionalSkills ? 'd-block' : ''}>
            {errors.additionalSkills}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="preferredInterviewTime" className="mb-3">
          <Form.Label>Preferred Interview Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="preferredInterviewTime"
            value={values.preferredInterviewTime}
            onChange={handleChange}
            isInvalid={!!errors.preferredInterviewTime}
            required
          />
          <Form.Control.Feedback type="invalid">{errors.preferredInterviewTime}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">Submit</Button>
      </Form>

      {submittedData && (
        <div className="mt-4 p-3 border rounded summary">
          <h2>Submitted Data</h2>
          <p><strong>Full Name:</strong> {submittedData.fullName}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Phone Number:</strong> {submittedData.phoneNumber}</p>
          <p><strong>Position:</strong> {submittedData.position}</p>
          {(submittedData.position === 'Developer' || submittedData.position === 'Designer') && (
            <p><strong>Relevant Experience:</strong> {submittedData.relevantExperience} years</p>
          )}
          {submittedData.position === 'Designer' && (
            <p><strong>Portfolio URL:</strong> {submittedData.portfolioURL}</p>
          )}
          {submittedData.position === 'Manager' && (
            <p><strong>Management Experience:</strong> {submittedData.managementExperience}</p>
          )}
          <p><strong>Additional Skills:</strong> {Object.keys(submittedData.additionalSkills).filter(skill => submittedData.additionalSkills[skill]).join(', ')}</p>
          <p><strong>Preferred Interview Time:</strong> {submittedData.preferredInterviewTime}</p>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
