import React from 'react';
import {
    Button,
    Card,
    H2,
    Position,
    Popover,
    Menu,
    MenuItem,
    InputGroup,
    Collapse,
    Overlay,
    Tag
} from "@blueprintjs/core";
import TaskFields from "./taskFields";
import {DateInput} from "@blueprintjs/datetime";
import moment from "moment";
import SubTask from "./subTask.js";
import ShowSubTasks from "./showSubTasks.js";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskList: [],
            subTasks: {},
            tempEdit: null,
            tempEditJson: {},
            openOverLay: false,
            overLayIndexToSend: null,
            overLayVersionToSend: null
        }
    }


    saveRecord(newList) {
        let {taskList} = this.state;
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].versionName === newList.versionName) {
                window.alert("Same Version Task is already present,Please change version number")
                return;
            }
        }

        taskList.push(newList)
        this.setState({
            taskList: taskList
        })

    }

    setAction(action, index, version) {
        let {taskList, tempEdit} = this.state
        switch (action) {
            case "create":
                this.setState({
                    openOverLay: true,
                    overLayIndexToSend: index,
                    overLayVersionToSend: version
                })
                break;
            case "delete":
                taskList.splice(index, 1)
                this.setState({
                    taskList: taskList
                })
                break;
            case "edit":

                if (tempEdit !== null)
                    taskList[tempEdit].editState = false

                taskList[index].editState = true
                this.setState({
                    taskList: taskList,
                    tempEdit: index
                })
                break;
        }

    }

    editState(type, event) {
        let {tempEditJson} = this.state;
        let date;

        switch (type) {
            case "startDate":
                date = new Date(event);
                tempEditJson.startDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                break;
            case "releaseDate":
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
                    status = "In Progress"
                } else if (progress > 0 && progress < 99) {
                    status = "Unreleased"

                } else if (progress === 100) {
                    status = "Released"

                }
                tempEditJson.progress = progress
                tempEditJson.status = status
                break;


        }
        this.setState({
            tempEditJson: tempEditJson
        })


    }

    saveOrCancelState(type, index, event) {
        let {tempEditJson, taskList} = this.state;

        if (type === "save") {
            let keys = Object.keys(tempEditJson);
            for (let i = 0; i < keys.length; i++) {
                taskList[index][keys[i]] = tempEditJson[keys[i]];
            }
            taskList[index].editState = false
            this.setState({
                taskList: taskList
            })


        } else {
            taskList[index].editState = false
            this.setState({
                taskList: taskList
            })

        }
    }

    toggleCollapse(index) {
        let {taskList} = this.state;
        taskList[index].openCollapse = !taskList[index].openCollapse
        this.setState({
            taskList: taskList
        })

    }


    createSubTask(index, versionName, json) {
        let {subTasks, taskList} = this.state;
        if (subTasks.hasOwnProperty(versionName)) {
            let existingArray = subTasks[versionName];
            existingArray.push(json)

        } else {
            let newArray = []
            newArray.push(json);
            subTasks[versionName] = newArray

        }
        this.setState({
            subTasks: subTasks,
            openOverLay: false
        })
    }

    handleSubTaskChange(versionName, type, data, index) {
        let {subTasks} = this.state;
        if (type === "delete") {
            subTasks[versionName].splice(index, 1)
        } else {


        }

    }

    closeOverLay() {
        this.setState({
            openOverLay: false
        })
    }


    render() {
        let dateFormat = "DD/MM/YYYY";
        let {taskList} = this.state
        return (
            <div>
                <Card style={{width: "75%", marginLeft: "15%", height: "500px"}}>
                    <p>
                        Projects / ENV1.5
                    </p>
                    <H2>
                        Releases
                    </H2>
                    <div style={{overflow: "auto", height: "400px"}}>
                        <table className="bp3-html-table  bp3-html-table-condensed bp3-html-table-bordered"
                               style={{width: "100%"}}>
                            <thead>
                            <tr>
                                <td>Version</td>
                                <td>Status</td>
                                <td>Progress</td>
                                <td>Start Date</td>
                                <td>Release Date</td>
                                <td>Descriptions</td>
                                <td>Actions</td>
                            </tr>
                            </thead>
                            <tbody>
                            {taskList.map((data, index) =>
                                <React.Fragment>
                                    <tr onClick={this.toggleCollapse.bind(this, index)}>
                                        <td>{data.versionName}</td>
                                        <td><Tag
                                            intent={data.status === "Released" ? "success" : "primary"}>{data.status}</Tag>
                                        </td>
                                        {data.editState ? (<td onClick={(event => event.stopPropagation())}><InputGroup
                                            placeholder="progress"
                                            onChange={this.editState.bind(this, "progress")}
                                            type="number"/></td>) : (
                                            <td>{data.progress}%</td>)}
                                        {data.editState ? (<td onClick={(event => event.stopPropagation())}><DateInput
                                            formatDate={date => moment(date).format(dateFormat)}
                                            parseDate={str => new Date(str)}
                                            onChange={this.editState.bind(this, "startDate")}
                                            popoverProps={{position: Position.BOTTOM}}
                                            placeholder={data.startDate}/></td>) : (<td>{data.startDate}</td>)}
                                        {data.editState ? (<td onClick={(event => event.stopPropagation())}><DateInput
                                            formatDate={date => moment(date).format(dateFormat)}
                                            parseDate={str => new Date(str)}
                                            onChange={this.editState.bind(this, "releaseDate")}
                                            popoverProps={{position: Position.BOTTOM}}
                                            placeholder={data.releaseDate}/></td>) : (<td>{data.releaseDate}</td>)}
                                        {data.editState ? (
                                            <td onClick={(event => event.stopPropagation())}><InputGroup
                                                placeholder="Description"
                                                onChange={this.editState.bind(this, "description")}
                                            /></td>) : (
                                            <td>{data.description}</td>)}


                                        <td onClick={(event => event.stopPropagation())}>{!data.editState ? (
                                            <Popover content={(<Menu>
                                                <MenuItem icon="edit" text="Edit"
                                                          onClick={this.setAction.bind(this, "edit", index)}/>
                                                <MenuItem icon="trash" text="Delete"
                                                          onClick={this.setAction.bind(this, "delete", index)}/>
                                                <MenuItem icon="th" text="Create Task"
                                                          onClick={this.setAction.bind(this, "create", index, data.versionName)}/>
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
                                    <tr style={{width: "100%"}}>
                                        <td colSpan={7}>
                                            <Collapse isOpen={data.openCollapse}>
                                                <ShowSubTasks subTasks={this.state.subTasks[data.versionName]}
                                                              versionName={data.versionName}
                                                              handleSubTaskChange={this.handleSubTaskChange.bind(this)}/>

                                            </Collapse>
                                        </td>
                                    </tr>

                                </React.Fragment>
                            )}

                            </tbody>
                        </table>
                    </div>

                </Card>
                <TaskFields updateRelease={this.saveRecord.bind(this)}/>


                <Overlay isOpen={this.state.openOverLay} onClose={this.closeOverLay.bind(this)}>
                    <Card style={{width: "75%", marginRight: "15%", marginTop: "5%"}}>
                        <SubTask index={this.state.overLayIndexToSend}
                                 createSubTask={this.createSubTask.bind(this)}
                                 versionName={this.state.overLayVersionToSend}/>
                    </Card>
                </Overlay>

            </div>
        )
    }

}

export default App;