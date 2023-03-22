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
import AddCourse from "./AddCourse";
import {DataGrid} from "@mui/x-data-grid";
import SchedList from "./SchedList";
import AddStudent from './AddStudent';
class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = { students: [] };
    }

    componentDidMount() {
        // To-Do: Configure backend to handle a general GET for all logged students
        this.fetchStudents();
    }
    fetchStudents = () => {
        console.log("StudentList.fetchStudents");
        const token = Cookies.get('XSRF-TOKEN');

        fetch(`${SERVER_URL}students`,
            {
                method: 'GET',
                headers: { 'X-XSRF-TOKEN': token }
            } )
            .then((response) => {
                console.log("FETCH RESP:"+response);
                console.log("Response Status Code: " + response.status);
                
                return response.json();})
            .then((responseData) => {
                
                console.log("Testing Response Type");
                console.log(responseData);
                
                if(Array.isArray(responseData)){
                    console.log("responseData is an array");
                }

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

    onDelClick = (student) => {
        console.log("Deleting Student" + student);
        
        if (window.confirm('Are you sure you want to drop this student?')) {
            const token = Cookies.get('XSRF-TOKEN');

            fetch(`${SERVER_URL}student`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': token  },
                    body: JSON.stringify(student)
                })
                .then(res => {
                    if (res.ok) {
                        toast.success("Student successfully dropped", {
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                        this.fetchCourses();
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
        const token = Cookies.get('XSRF-TOKEN');

        console.log("POST requesting to add student: ");
        console.log(student);
        
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
        const columns = [
            { field: 'name', headerName: 'Name', width: 400 },
            { field: 'email', headerName: 'Email', width: 125 },
            { field: 'statusCode', headerName: 'Status Code', width: 125 },
            { field: 'status', headerName: 'Status', width: 125 },
            {
                field: 'id',
                headerName: '  ',
                sortable: false,
                width: 200,
                //To-Do: add grid-cell button to delete entry (Finish fetch first)
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