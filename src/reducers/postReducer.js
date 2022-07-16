//The Post data from the backend would be comming to this place 
// import uuid from "uuid";
import { GET_POSTS , ADD_POSTS , DELETE_POSTS, POSTS_LOADING} from "../actions/types";
const initialState = {
    postsData: [],
    loading: false
}
//This Part would Return the Final State and the Performed action to the Combined reducer"/index.js"
//Which would then return the Final state and Action to the Store
export default function (state = initialState, action)
{
    switch(action.type)
    {
        case GET_POSTS:
            return{
                ...state,
                postsData: action.payload,
                loading: false
            };
        case DELETE_POSTS:
            return{
                ...state,
                postsData: state.postsData.filter(post => post._id !== action.payload)
            }
        case ADD_POSTS:
            return{
                ...state,
                postsData: [action.payload,...state.postsData]
            }  
        case POSTS_LOADING:
            return{
                ...state,
                loading:true
            } 
        default:
            return state;
    }
}