import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { Component } from 'react';



class TreatmentCreate extends Component{

    constructor(props) {
        super(props)
        this.state = {
            treatments: [],
            status: 0,
            statusbase: 0
        }
    }
    componentDidMount() {
        Axios.get(`/api/mtomady/category/${this.props.match.params.category_id}/treatments`)
            .then((resp) => {
                this.setState({treatments: resp.data.data})
            })
            .catch((resp) => console.log(resp))
    }
    removetreatment(treatment_id) {
        Axios.delete(`/api/mtomady/category/${this.props.match.params.category_id}/treatments/${treatment_id}`)
            .then((resp) => {
                console.log(resp)
                if (resp.status == 200 || resp.status == 204) {
                    this.setState({
                        treatments: this.state.treatments.filter((i) => i.id !== treatment_id )
                    })
                }
            })
            .catch((resp) => console.log(resp))
    }
    render() {
        const List = this.state.treatments.map((treatment, key) => {
            return (
                <div key={key} >
                    <hr />
                    <div className="flex-box-2">
                        {treatment.attributes.name}
                        <div className="link-right flex-box">
                            {this.state.status === treatment.id ? (<div className="cat-create-form flex-box flex-d-c">
                                <Formik
                                initialValues={{
                                    name: treatment.attributes.name,
                                    name_fr: treatment.attributes.name_fr,
                                    name_mg: treatment.attributes.name_mg
                                }}
                                onSubmit={async (values) => {
                                    Axios.put(`/api/mtomady/category/${this.props.match.params.category_id}/treatments/${treatment.id}`, values)
                                        .then(resp => {
                                            if (resp.status == 200 || resp.status == 204) {
                                                this.setState({
                                                    status: 0,
                                                    treatments: [resp.data.data,...this.state.treatments.filter((i) => i.id !== treatment.id )]
                                                })
                                            }else {
                                                alert("Error on save")
                                                this.setState({
                                                    status: 0
                                                })
                                            }
                                        })
                                    .catch(resp =>{})
                                    values.name = ""
                                    values.name_fr = ""
                                    values.name_mg = ""
                                }}
                                    >
                                <Form className="form flex-box flex-d-c">
                                    <div className="Title field-title">Edit treatment</div>
                                    <label >English category's name</label>
                                    <Field name="name" type="text" required/>
                                    <label >French category's name</label>
                                    <Field name="name_fr" type="text" />
                                    <label >Malagasy category's name</label>
                                    <Field name="name_mg" type="text" />
                                    <button type="submit">Submit</button>
                                <p className="annulation" onClick={() => { this.setState({ status: 0 }) }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </p>
                                </Form>
                                </Formik>
                            </div>): (<button onClick={() => { this.setState({ status: treatment.id }) }} >Edit</button>)    
                            }
                            <p className="delete" onClick={() => { if(window.confirm('Delete the item?')){this.removetreatment(treatment.id)} }} ><FontAwesomeIcon icon={faTrash} /></p>
                            
                        </div>
                    </div>
                </div>
            )
        })
        return <div className="category-create-box p-8">
            <div className="Title">Treatment list</div>
            {this.state.statusbase === 0 ? (<button onClick={() => { this.setState({ statusbase: 1 }) }}>Create a new treatment</button>) : (<div className="cat-create-form flex-box flex-d-c">                
                <Formik
                initialValues={{
                    name: "",
                    name_fr: "",
                    name_mg: ""
                }}
                onSubmit={async (values) => {
                    Axios.post(`/api/mtomady/category/${this.props.match.params.category_id}/treatments`, values)
                        .then(resp => {
                        if (resp.status == 200 || resp.status == 204) {
                            this.setState({
                                statusbase: 0,
                                treatments: [resp.data.data,...this.state.treatments]
                            })
                        }else {
                            alert("Error on save")
                            this.setState({
                                statusbase: 0
                            })
                        }
                    })
                    .catch(resp =>{})
                    console.log(values)
                    values.name = ""
                    values.name_fr = ""
                    values.name_mg = ""
                }}
                    >
                <Form className="form flex-box flex-d-c">
                <div className="Title field-title">Type new treatment's name </div>
                <label >English category's name</label>
                <Field name="name" type="text" required placeholder="Example Name"/>
                <label >French category's name</label>
                <Field name="name_fr" type="text" placeholder="Example Name"/>
                <label >Malagasy category's name</label>
                <Field name="name_mg" type="text" placeholder="Example Name"/>
                <button type="submit">Submit</button>
                <p className="annulation" onClick={() => { this.setState({ statusbase: 0 }) }}>
                    <FontAwesomeIcon icon={faTimes} />
                </p>
                </Form>
            </Formik>
            </div>
            )}
            {List}
            <hr/>
        </div>
    }

}
export default TreatmentCreate;