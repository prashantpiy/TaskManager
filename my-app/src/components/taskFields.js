import React from 'react';
import {Button, Card, H2, H3, H5, InputGroup, Classes, Position, Popover, Menu, MenuItem} from "@blueprintjs/core";
import Grid from "@material-ui/core/Grid";
import {DateInput, DatePicker} from "@blueprintjs/datetime";
import moment from "moment";

class TaskFields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            versionName: "",
            startDate: "",
            releaseDate: "",
            description: "",
            subTasks: {}
        }
    }

    handleReleaseDateChange(event) {
        let date = new Date(event);
        let str = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        this.setState({
            releaseDate: str
        })
    }

    handleStartDateChange(event) {
        let date = new Date(event);
        let str = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        this.setState({
            startDate: str
        })
    }

    setVersionName(e) {
        this.setState({
            versionName: e.target.value
        })
    }

    setDescription(e) {
        this.setState({
            description: e.target.value
        })

    }

    saveRecord() {
        let {versionName, description, startDate, releaseDate} = this.state
        if (!versionName) alert("Version Name Cannot be empty")
        else if (!startDate) alert("Start Date Cannot be empty")
        else {
            let json = {
                versionName: versionName,
                description: description,
                startDate: startDate,
                releaseDate: releaseDate,
                progress:0,
                status:"In Progress"
            }
            json.editState = false
            json.openCollapse = false


            this.props.updateRelease(json)
        }
    }


    render() {
        let dateFormat = "DD/MM/YYYY";
        return (
            <div>
                <Card style={{width: "75%", marginLeft: "15%"}}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={2}
                    >
                        <Grid item sm={4}>
                            <InputGroup
                                placeholder="Version Name"
                                onChange={this.setVersionName.bind(this)}
                                value={this.state.versionName}
                            />
                        </Grid>
                        <Grid item sm={2}>
                            <DateInput
                                formatDate={date => moment(date).format(dateFormat)}
                                parseDate={str => new Date(str)}
                                onChange={this.handleStartDateChange.bind(this)}
                                popoverProps={{position: Position.BOTTOM}}
                                placeholder="Start Date"/>
                        </Grid>
                        <Grid item sm={2}>
                            <DateInput
                                formatDate={date => moment(date).format(dateFormat)}
                                parseDate={str => new Date(str)}
                                onChange={this.handleReleaseDateChange.bind(this)}
                                popoverProps={{position: Position.BOTTOM}}
                                placeholder="Release Date"/>
                        </Grid>
                        <Grid item sm={3}>
                            <InputGroup placeholder="Description" onChange={this.setDescription.bind(this)}
                                        value={this.state.description}/>
                        </Grid>
                        <Grid item sm={1}>
                            <Button intent="primary" text="Add" onClick={this.saveRecord.bind(this)}/>
                        </Grid>
                    </Grid>
                </Card>


            </div>
        )
    }

}

export default TaskFields;

