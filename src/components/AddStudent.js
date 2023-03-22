import React, {Component} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import {SEMESTER_LIST, SERVER_URL} from "../constants";

class AddStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false, student:{id:"",name:"", email:"", statusCode:""}};
    };

    handleClickOpen = () => {
        this.setState( {open:true} );
    };

    handleClose = () => {
        this.setState( {open:false} );
    };

    handleNameChange = (event) => {
        this.setState({student:{name: event.target.value, email: this.state.student.email}});

    }
    handleEmailChange = (event) => {
        this.setState({student:{name: this.state.student.name, email: event.target.value}});
    }
    handleAdd = () => {
        //console.log("Accessing Student: " + JSON.stringify({name: this.state.name, email: this.state.email}));
        console.log("Accessing Student: " + JSON.stringify({student:{name: this.state.student.name, email: this.state.student.email}}));

        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}student`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': token  },
                body: JSON.stringify({student:{name: this.state.student.name, email: this.state.student.email}})
            });
        this.props.addStudent(this.state.student)
        this.handleClose();
    }

    render()  {
        return (
            <div>
                <Button variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleClickOpen}>
                    Add Student
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>Add Student</DialogTitle>
                    <DialogContent style={{paddingTop: 20}} >
                        <TextField fullWidth label="Name" name="student_name" onChange={this.handleNameChange}  />
                        <TextField fullWidth label="Email" name="student_email" onChange={this.handleEmailChange}  />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                        <Button id="Add" color="primary" onClick={this.handleAdd}>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

AddStudent.propTypes = {
    addStudent : PropTypes.func.isRequired
}

export default AddStudent;