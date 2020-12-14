import React, { Component } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import CategoryList from './components/CategoryList';
import Searchbar from '../Treatements/component/Searchbar';
import history from '../history';
import './category.scss'

class Category extends Component{
    constructor(props){
        super(props)
        this.state = {
            filterTextCategory: "",
            filterTextTreatment: "",
            patient_name: "",
            status: 1
        }
        this.findtextCategory = this.findtextCategory.bind(this)
        this.findtextTreatment = this.findtextTreatment.bind(this)
    }
    findtextCategory(filterTextCategory) {
        this.setState({filterTextCategory: filterTextCategory})
    }

    findtextTreatment(filterTextTreatment) {
        this.setState({filterTextTreatment: filterTextTreatment})
    }

    render() {
        if (this.state.status == 0) {
            return <div className="form-box flex-box flex-d-c">
                <Formik
                    initialValues={{
                        give_name: ""
                    }}
                    onSubmit={async (values) => {
                        this.setState({
                            patient_name: values.give_name,
                            status: 1
                        })
                        values.give_name = ""
                    }}
                        >
                    <Form className="form">
                        <p>Type your name.</p>
                        <Field name="give_name" type="text" required placeholder="Name"/>
                        <button type="submit">Submit</button>
                    </Form>
                </Formik>
            </div>
        }

        return <div className="next-form p-8">
            <div className="Title">Categories list </div>
            
            <Formik
                initialValues={{
                    patient: `${this.state.patient_name}`,
                    treatment_id: ""
                }}
                onSubmit={async (values) => {
                    axios.post('/treatment_patient_refs', values)
                        .then(resp => {
                            if (resp.status == 204) {
                                alert('Data save')
                                history.push('/')
                                window.location.reload()
                            } else {
                                alert('Error to save')
                            }
                    })
                    .catch(resp =>{})
                    values.treatment_id = ""
                    values.patient = " "
                    
                }}
                    >
                <Form>
                    <div className="list-box-o b-bottom">
                        <Field name="patient" type="text" required hidden />
                        <div className="form-field">
                        <div className="name">Welcome <span>{this.state.patient_name}</span> </div>
                            <Searchbar
                            placeholder="Find category"
                            filterText={this.state.filterTextCategory}
                            onFindtext={this.findtextCategory}
                            />
                        </div>
                    </div>
                    <div className="list-box-o make-overflow">
                        <CategoryList
                        onFindtextSearch={this.findtextTreatment}
                        filterText={this.state.filterTextTreatment}
                        filterTextC={this.state.filterTextCategory}
                        />
                    </div>
                    <div className="button list-box-o b-top">
                        <button type="submit">Submit</button>
                    </div>
                </Form>
            </Formik>
    </div>
   } 
}

export default Category;