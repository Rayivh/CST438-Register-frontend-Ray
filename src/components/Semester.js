import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import {DataGrid} from '@mui/x-data-grid';
import {SEMESTER_LIST, SERVER_URL} from '../constants.js'
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

// user selects from a list of  (year, semester) values
class Semester extends Component {
      constructor(props) {
      super(props);
      this.state = {selected: SEMESTER_LIST.length-1, open: false, name:"", email:""};
    }
 
    onRadioClick = (event) => {
        console.log("Semester.onRadioClick "+JSON.stringify(event.target.value));
        this.setState({selected: event.target.value});
    }
    handleClickOpen = () => {
        this.setState( {open:true} );
    };

    handleClose = () => {
        this.setState( {open:false} );
    };

    // To-Do: Adapt to accept/store student name & email
    handleNameChange = (event) => {
        //console.log("Name Input Check: " + JSON.stringify(event.target.value));
        this.setState({name: event.target.value});
        //console.log("Name Property Check: " + this.state.name);
        //this.state.name = JSON.stringify(event.target.value);
        
    }
    handleEmailChange = (event) => {
        //console.log("Email Input Check: " + JSON.stringify(event.target.value));
        this.setState({email: event.target.value});
        //console.log("Email Property Check: " + this.state.email);

        //this.setState({student:{email: event.target.value}});
    }
    // To-Do: Adapt to accept/store student name & email
    handleAdd = () => {
        //this.props.addStudent(this.state.student);
        
        // add a student
        console.log("Accessing Student: " + JSON.stringify({name: this.state.name, email: this.state.email}));
        
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}student`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': token  },
                body: JSON.stringify({name: this.state.name, email: this.state.email})
            });
        
        this.handleClose();
    }

    render() {    
      const icolumns = [
      {
        field: 'id',
        headerName: 'Year',
        width: 200,
        renderCell: (params) => (
          <div>
            <Radio
              checked={params.row.id == this.state.selected}
              onChange={this.onRadioClick}
              value={params.row.id}
              color="default"
              size="small"
            />
            { SEMESTER_LIST[params.row.id].year }
          </div>
        )
      },
      { field: 'name', headerName: 'Semester', width: 200 }
      ];
      return (
       <div>
         <AppBar position="static" color="default">
            <Toolbar>
               <Typography variant="h6" color="inherit">
                  Schedule - select a term
               </Typography>
            </Toolbar>
         </AppBar>
         <div align="left" >
            <div style={{ height: 400, width: '100%', align:"left"   }}>
            <DataGrid   rows={SEMESTER_LIST} columns={icolumns} />
            </div>
             <Button component={Link}
                     to={{pathname:'/schedule',
                         year:SEMESTER_LIST[this.state.selected].year,
                         semester:SEMESTER_LIST[this.state.selected].name}}
                     variant="outlined" color="primary" style={{margin: 10}}>
                 Get Schedule
             </Button>

             <Button component={Link}
                     to={{pathname:'/student'}}
                     variant="outlined" color="primary" style={{margin: 10}}>
                 Get Students
             </Button>
             
            <Button 
                variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleClickOpen}>
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
      </div>
    )
    }
}

// Semester.propTypes = {
//     addStudent : PropTypes.func.isRequired
// }
export default Semester;