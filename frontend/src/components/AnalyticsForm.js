import React from 'react';

import {
    TextInput, 
    Button, 
    ButtonSkeleton, 
    InlineNotification, 
    Row, 
    Column, 
    DatePicker, 
    DatePickerInput,
    Dropdown } from 'carbon-components-react';

import { Form, Field, reduxForm } from "redux-form";


const issueStates = {
    ALL: 'all',
    OPEN: 'open',
    CLOSED: 'closed'
};

const RenderTextField = field => (
    <TextInput
        type="text"
        labelText={field.label}
        placeholder={field.placeholder}
        // disabled={}
        defaultValue={field.input.value}
        onChange={e => field.input.onChange(e.target.value)}
    />
)

const RenderDropdown = field => (
    <Dropdown
        titleText={field.label}
        items={Object.keys(issueStates)}
        label={Object.keys(issueStates).find(key => issueStates[key] === (field.input.value))}
        onChange={e => field.input.onChange(issueStates[e.selectedItem])}
        // disabled={loading}
    />
)

const RenderDatePicker = field => (
    <DatePicker
        dateFormat="m/d/Y"
        datePickerType="single"
        locale="en"
        onChange={(e) => field.input.onChange(new Date(e[0]).toISOString()) }
        >
        <DatePickerInput
            // disabled={loading}
            labelText={field.label}
            pattern="d{1,2}/d{1,2}/d{4}"
            placeholder="mm/dd/yyyy"
            type="text"
        />
    </DatePicker>
);

const AnalyticsForm = ({ errorMessage, loading, handleSubmit }) => (
    <Form>
        <Row>
            <Column>
                <h1>Gather analytics data for a Github repository</h1>
                <br />
                {errorMessage &&
                    <InlineNotification 
                        kind='error'
                        title=''
                        lowContrast
                        subtitle={errorMessage}
                        style={{ minWidth: '100%' }}
                    />
                }
            </Column>
        </Row>
        <Row>
            <Column>
                <Field 
                    component={RenderTextField}
                    label="Repository Owner"
                    name="ownerName"
                    placeholder="e.g., openliberty"
                />
            </Column>
            <Column>
                <Field 
                    component={RenderTextField}
                    label="Repository Name"
                    name="repoName"
                    placeholder="e.g., open-liberty"
                />
            </Column>
            <Column>
                <Field 
                    component={RenderDatePicker}
                    label="Created since"
                    name="since"
                />
            </Column>
        </Row>
        <Row>
            <Column>
                <br />
                <Field
                    component={RenderDropdown}
                    label='Issue state'
                    name='issueState'
                />
            </Column>
            <Column />
            <Column />
        </Row>
        <Row>
            <Column>
                <br />
                <hr />
                {loading ?
                    <ButtonSkeleton style={{ float: 'right' }}/> :
                    <Button onClick={handleSubmit} style={{ float: 'right' }}>Gather data!</Button>     
                }
            </Column>
        </Row>
    </Form>
);

export default reduxForm({
    form: 'github'
})(AnalyticsForm);