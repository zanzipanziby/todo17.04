import React from 'react';
import {TaskStatuses} from "../../types/types";

type TaskPropsType = {
    title: string
    status: TaskStatuses
}


const Task = (props: TaskPropsType) => {
    return (
       <div>
           <input type="checkbox" checked={props.status === TaskStatuses.Completed}/>
           <span>{props.title}</span>
           <button>x</button>
       </div>
    );
};

export default Task;