import * as TYPES from "../../types";

const initialState: any = {
    full_sync: true,
    projects: [],
    sync_token: "",
    temp_id_mapping: {},
    isLoading: true
}

function projectReducer(state: any = initialState, action: {
    type: string,
    payload?: any
}) {
    switch (action.type) {
        case TYPES.LOADING:
            return {
                ...state,
                isLoading: true,
            }
        case TYPES.PROJECTS:
            return {
                ...state,
                projects: action.payload.projects,
                full_sync: action.payload.full_sync,
                sync_token: action.payload.sync_token,
                temp_id_mapping: action.payload.temp_id_mapping,
                isLoading: false,
            }
        case TYPES.ERROR:
            return {
                ...state,
                isLoading: false,
                message: action.payload.message
            }
        default:
            return state
    }
}

export default projectReducer;