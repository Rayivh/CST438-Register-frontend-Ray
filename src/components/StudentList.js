import React, {Component} from "react";
import Cookies from "js-cookie";
import {SERVER_URL} from "../constants";
import {toast, ToastContainer} from "react-toastify";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import {DataGrid} from "@mui/x-data-grid";
import AddStudent from './AddStudent';

class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = { students: [] };
    }
    componentDidMount() {
        this.fetchStudents();
    }
    fetchStudents = () => {
        console.log("Fetching list of students");
        
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}students`,
            {
                method: 'GET',
                headers: { 'X-XSRF-TOKEN': token }
            } )
            .then((response) => {
                console.log("Response Code: " + response.status);
                
                return response.json();})
            .then((responseData) => {

                // do a sanity check on response
                if (Array.isArray(responseData)) {
                    this.setState({
                        students: responseData,
                    });
                } else {
                    toast.error("Fetch failed. Not Array", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            })
            .catch(err => {
                toast.error("Fetch failed.", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                console.error(err);
            })
    }

    onDelClick = (id) => {
        console.log("Warning: Delete Student: " + id + "?");
        if (window.confirm('Are you sure you want to drop this student?')) {
            console.log("Deleting...");
            let students = this.state.students;
            let studentPending;
            for (let student in students){
                if(students[student]["student_id"] === id){
                    studentPending = {"email":students[student]["email"],"name":students[student]["name"]};
                    break;
                }
            }
            
            const token = Cookies.get('XSRF-TOKEN');
            fetch(`${SERVER_URL}student`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': token  },
                    body: JSON.stringify(studentPending)
                })
                .then(res => {
                    if (res.ok) {
                        toast.success("Student successfully dropped", {
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                        this.fetchStudents();
                    } else {
                        toast.error("Student drop failed", {
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                        console.error('Delete http status =' + res.status);
                    }})
                .catch(err => {
                    toast.error("Student drop failed", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                    console.error(err);
                })
        }
    }
    addStudent = (student) => {
        console.log("Adding student... name:" + student["name"] + " email:" + student["email"]);
        
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}student`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token  },
                body: JSON.stringify(student)
            })
            .then(res => {
                if (res.ok) {
                    toast.success("Student successfully added", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                    this.fetchStudents();
                } else {
                    toast.error("Error when adding", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                    console.error('Post http status =' + res.status);
                }})
            .catch(err => {
                toast.error("Error when adding", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                console.error(err);
            })
    }
    render() {
        let students = this.state.students;
        for (let student in students){
            // Add extra field for DataGrid to bind a button
            students[student]["id"] = students[student]["student_id"];
        }
        
        const columns = [
            { field: 'student_id', headerName: 'ID', width: 100},
            { field: 'name', headerName: 'Name', width: 200 },
            { field: 'email', headerName: 'Email', width: 200 },
            { field: 'statusCode', headerName: 'Status Code', width: 125 },
            { field: 'status', headerName: 'Status', width: 125 },
            {
                field: 'id',
                headerName: 'Actions',
                sortable: false,
                width: 200,
                renderCell: (params) => (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            style={{ marginLeft: 16 }}
                            onClick={()=>{this.onDelClick(params.value)}}
                        >
                            Drop
                        </Button>
                )
            }
        ];

        return(
            <div>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            { 'Students'}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className="App">
                    <div style={{width:'100%'}}>
                        For DEBUG:  display state.
                        {JSON.stringify(this.state)}
                    </div>
                    <Grid container>
                        <Grid item>
                            <ButtonGroup>
                                <AddStudent addStudent={this.addStudent}  />
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={this.state.students}  columns={columns} getRowId={(row) => row.student_id}  />
                        
                    </div>
                    <ToastContainer autoClose={1500} />
                </div>
            </div>
        );
    }
}

export default StudentList;