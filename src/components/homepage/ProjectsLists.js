import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
//import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import ProjectItem from './ProjectItem';
import List from 'material-ui/List';

/*
const styles = {
    Paper: {
        padding: 20
    }
}
*/


class ProjectsLists extends Component {

    getYourId() {
        return 2;
    }

    getProjectList(type) {

        const projects = this.props.projects;
        const filterText = this.props.filterText;

        const projectList = projects
            .filter(project => {
                if (type === 1) {
                    return project.supervisor === this.getYourId();
                }
                else if (type === 2) {
                    return project.status === "inprogress";
                }
                return project.status === "done";
            })
            .filter(project => {

                return project.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0
            })
            .map(project => {
                return (
                    <ProjectItem key={project.id} project={project} />
                )
            })

        return (
            <List>
                {projectList}
            </List>
        )
    }

    render() {

        return (
            <div>
                <Typography variant="display1" color="inherit" >
                    Projects
                </Typography>

                <Grid container>

                    <Grid item sm>
                        <Typography variant="subheading" color="inherit" >
                            Assigned
                        </Typography>
                        {this.getProjectList(1)}
                    </Grid>

                    <Grid item sm>
                        <Typography variant="subheading" color="inherit" >
                            In Progress
                        </Typography>
                        {this.getProjectList(2)}
                    </Grid>

                    <Grid item sm>
                        <Typography variant="subheading" color="inherit" >
                            Done
                        </Typography>
                        {this.getProjectList(3)}
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default ProjectsLists;