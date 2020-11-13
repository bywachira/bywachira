import { combineReducers } from "redux";
import projectsReducer from "./projects"

const rootReducer = combineReducers({
    projects: projectsReducer
})

export default rootReducer;