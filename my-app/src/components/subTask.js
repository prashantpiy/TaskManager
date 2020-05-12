import React from 'react';
import {
    Button,
    Card,
    H2,
    H3,
    H5,
    InputGroup,
    Classes,
    Position,
    Popover,
    Menu,
    MenuItem,
    TextArea
} from "@blueprintjs/core";
import Grid from "@material-ui/core/Grid";
import {DateInput, DatePicker} from "@blueprintjs/datetime";
import moment from "moment";

class SubTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            progress: "",
            startDate: "",
            endDate: "",
            description: "",
            taskName: "",
            subTasks: {}
        }
    }

    handleEndDateChange(event) {
        let date = new Date(event);
        let str = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        this.setState({
            endDate: str
        })
    }

    handleStartDateChange(event) {
        let date = new Date(event);
        let str = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        this.setState({
            startDate: str
        })
    }

    setProgress(e) {
        this.setState({
            progress: e.target.value
        })
    }

    setDescription(e) {
        this.setState({
            description: e.target.value
        })

    }

    setTaskName(e) {
        this.setState({
            taskName: e.target.value
        })

    }

    saveRecord() {
        let {description, startDate, endDate, taskName, progress} = this.state
        let json = {
            taskName: taskName,
            description: description,
            startDate: startDate,
            endDate: endDate,
            progress: progress
        }
        let status;
        if (progress === 0) {
            status = "Progress"
        } else if (progress > 0 && progress < 99) {
            status = "Unreleased"

        }
        if (progress === 100) {
            status = "Released"

        }
        json.editState = false
        json.status = status
        this.props.createSubTask(this.props.index, this.props.versionName, json)

    }


    render() {
        let dateFormat = "DD/MM/YYYY";
        console.log("props", this.props.versionName)
        return (
            <div>
                <H3 style={{textAlign: "center"}}>Add task for version - {this.props.versionName} </H3>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                >
                    <Grid item sm={6}>
                        <InputGroup
                            placeholder="Task Name"
                            onChange={this.setTaskName.bind(this)}
                            value={this.state.taskName}/>
                    </Grid>
                    <Grid item sm={6}>
                        <InputGroup
                            placeholder="Progress"
                            onChange={this.setProgress.bind(this)}
                            value={this.state.progress}
                            type="number"/>
                    </Grid>
                    <Grid item sm={6}>
                        <DateInput
                            formatDate={date => moment(date).format(dateFormat)}
                            parseDate={str => new Date(str)}
                            onChange={this.handleStartDateChange.bind(this)}
                            popoverProps={{position: Position.BOTTOM}}
                            placeholder="Start Date"
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <DateInput
                            formatDate={date => moment(date).format(dateFormat)}
                            parseDate={str => new Date(str)}
                            onChange={this.handleEndDateChange.bind(this)}
                            popoverProps={{position: Position.BOTTOM}}
                            placeholder="End Date"/>
                    </Grid>
                    <Grid item sm={12}>
                        <TextArea placeholder="Description" onChange={this.setDescription.bind(this)}
                                  value={this.state.description}
                                  style={{width: "100%", height: "200px"}}/>
                    </Grid>
                    <Grid item sm={12}
                          style={{textAlign: "center"}}>
                        <Button intent="primary" text="Add" onClick={this.saveRecord.bind(this)}/>
                    </Grid>
                </Grid>
            </div>


        )
    }

}

export default SubTask;

