import React, { Component } from 'react';
import {
    ListItem,
    ListItemAvatar,
    ListItemText,
} from 'material-ui/List';
import FolderIcon from 'material-ui-icons/Folder';
import Avatar from 'material-ui/Avatar';
import { Link } from "react-router-dom";



class ProjectItem extends Component {
    render() {
        return (
            <Link style={{ textDecoration: 'none' }} to={{ pathname: `/projects/${this.props.project._id}`, state: {project:this.props.project}}}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={this.props.project.name}
                        secondary={this.props.project.desc}
                    />
                </ListItem>
            </Link>
        );
    }
}

export default ProjectItem;
