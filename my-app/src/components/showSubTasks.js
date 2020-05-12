import React from 'react';
import {
    Button,
    Card,
    InputGroup,
    Position,
    Popover,
    Menu,
    MenuItem, Tag, Intent, NumericInput
} from "@blueprintjs/core";
import {DateInput, DatePicker} from "@blueprintjs/datetime";
import moment from "moment";

class ShowSubTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tempEdit: null,
            tempEditJson: {},
            subTaskList: this.props.subTasks
        }
    }

    editSubState(type, event) {
        let {tempEditJson} = this.state;
        let date;
        switch (type) {
            case "startDate":
                date = new Date(event);
                tempEditJson.startDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                break;
            case "endDate":
                date = new Date(event);
                tempEditJson.releaseDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
                break;
            case "description":
                tempEditJson.description = event.target.value
                break;
            case "progress":
                let progress = parseInt(event.target.value);
                let status;
                if (progress === 0) {
                    status = "Progress"
                } else if (progress > 0 && progress < 99) {
                    status = "Unreleased"

                } else if (progress === 100) {
                    status = "Released"

                }
                tempEditJson.progress = event.target.value
                tempEditJson.status = status

                break;
            case "taskName":
                tempEditJson.taskName = event.target.value
                break;


        }
        this.setState({
            tempEditJson: tempEditJson
        })


    }


    saveOrCancelState(type, index) {
        let {tempEditJson, subTaskList} = this.state;

        if (type === "save") {
            let keys = Object.keys(tempEditJson);
            for (let i = 0; i < keys.length; i++) {
                subTaskList[index][keys[i]] = tempEditJson[keys[i]];
            }
            subTaskList[index].editState = false
            this.setState({
                subTaskList: subTaskList
            }, () => this.props.handleSubTaskChange(this.props.versionName, "edit", tempEditJson, index))


        } else {
            subTaskList[index].editState = false
            this.setState({
                subTaskList: subTaskList
            })

        }
    }

    setAction(action, index) {
        let {subTaskList, tempEdit} = this.state
        switch (action) {
            case "delete":
                subTaskList.splice(index, 1)
                this.setState({
                    subTaskList: subTaskList
                }, () => this.props.handleSubTaskChange(this.props.versionName, "delete", {}, index))
                break;
            case "edit":
                if (tempEdit)
                    subTaskList[tempEdit].editState = false

                subTaskList[index].editState = true
                this.setState({
                    subTaskList: subTaskList,
                    tempEdit: index
                })
                break;
        }

    }


    render() {
        let subTasks = this.props.subTasks
        let dateFormat = "DD/MM/YYYY";

        return (
            <Card style={{border: "1px solid"}}>
                {this.props.subTasks ? (
                    <table className="bp3-html-table  bp3-html-table-condensed"
                           style={{width: "100%"}}>
                        <thead>
                        <tr>
                            <td>Task Name</td>
                            <td>Status</td>
                            <td>Progress</td>
                            <td>Start Date</td>
                            <td>End Date</td>
                            <td>Descriptions</td>
                            <td>Action</td>
                        </tr>
                        </thead>
                        <tbody>
                        {subTasks.map((data, index) =>
                            <React.Fragment>
                                <tr>

                                    {data.editState ? (<td><InputGroup placeholder="taskName"
                                                                       onChange={this.editSubState.bind(this, "taskName")}/>
                                        </td>)
                                        : (<td>{data.taskName}</td>)}
                                    <td><Tag
                                        intent={data.status === "Released" ? "success" : "primary"}>{data.status}</Tag>
                                    </td>
                                    {data.editState ? (<td><InputGroup placeholder="progress"
                                                                       onChange={this.editSubState.bind(this, "progress")}
                                                                       type="number"/></td>) : (
                                        <td>{data.progress}%</td>)}

                                    {data.editState ? (<td><DateInput
                                        formatDate={date => moment(date).format(dateFormat)}
                                        parseDate={str => new Date(str)}
                                        onChange={this.editSubState.bind(this, "startDate")}
                                        popoverProps={{position: Position.BOTTOM}}
                                        placeholder={data.startDate}/></td>) : (<td>{data.startDate}</td>)}
                                    {data.editState ? (<td><DateInput
                                        formatDate={date => moment(date).format(dateFormat)}
                                        parseDate={str => new Date(str)}
                                        onChange={this.editSubState.bind(this, "endDate")}
                                        popoverProps={{position: Position.BOTTOM}}
                                        placeholder={data.releaseDate}/></td>) : (<td>{data.releaseDate}</td>)}
                                    {data.editState ? (
                                        <td><InputGroup placeholder="Description"
                                                        onChange={this.editSubState.bind(this, "description")}
                                        /></td>) : (
                                        <td>{data.description}</td>)}
                                    <td>{!data.editState ? (<Popover content={(<Menu>
                                        <MenuItem icon="edit" text="Edit"
                                                  onClick={this.setAction.bind(this, "edit", index)}/>
                                        <MenuItem icon="trash" text="Delete"
                                                  onClick={this.setAction.bind(this, "delete", index)}/>

                                    </Menu>)} position={Position.RIGHT_TOP}>
                                        <Button intent="minimal" text="..."/>
                                    </Popover>) : (
                                        <Popover content={(<Menu>
                                            <MenuItem icon="saved" text="Save"
                                                      onClick={this.saveOrCancelState.bind(this, "save", index)}/>
                                            <MenuItem icon="cross" text="Cancel"
                                                      onClick={this.saveOrCancelState.bind(this, "cancel", index)}/>

                                        </Menu>)} position={Position.RIGHT_TOP}>
                                            <Button intent="minimal" text="..."/>
                                        </Popover>
                                    )}

                                    </td>
                                </tr>
                            </React.Fragment>
                        )}

                        </tbody>
                    </table>
                ) : null}
            </Card>


        )
    }

}

export default ShowSubTasks;

