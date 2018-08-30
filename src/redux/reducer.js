import {GET_REPOS, GET_REPOS_SUCCESS, GET_REPOS_FAIL} from "./consts";

const initialState = {
    repos: [],
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_REPOS:
            return {...state, loading: true};
        case GET_REPOS_SUCCESS:
            return {...state, loading: false, repos: action.payload.data};
        case GET_REPOS_FAIL:
            return {
                ...state,
                loading: false,
                error: 'Error while fetching repositories'
            };
        default:
            return state;
    }
}
