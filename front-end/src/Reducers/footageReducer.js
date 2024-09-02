export const ACTIONS = Object.freeze({
    ADD_CAM: "ADD_CAM",
    REMOVE_CAM: "REMOVE_CAM"
});

export const INITIAL_STATE = {};

export const footageReducer = (state, action) =>{
    switch (action.type){
        case ACTIONS.ADD_CAM:
            return {
                ...state,
                [action.camIp]: {start: action.start, end: action.end}
            };

        case ACTIONS.REMOVE_CAM:
            delete state[action.camIp];
            return state;

        default:
            return state;
    }
}