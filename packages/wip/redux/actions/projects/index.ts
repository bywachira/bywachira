import axios from "axios";
import * as TYPES from "../../types";
import qs from "querystring";

export const fetchProjects = () => async (dispatch: Function) => {
    dispatch({
        type: TYPES.LOADING
    })

    const payload: any = {
        token: "f7d311a47a262fe38c8b7d6e7b4835c1c1a2da47",
        sync_token: "*",
        resource_types: "[projects]"
    }

    return axios.get(`https://api.todoist.com/rest/v1/projects`, {
        headers: {
            "Authorization": `Bearer ${payload.token}`
        }
    }).then(res => {
        dispatch({
            type: TYPES.PROJECTS,
            payload: res.data
        })
    })
        .catch(err => {
            dispatch({
                type: TYPES.ERROR,
                payload: err.response.data
            })
        })
}