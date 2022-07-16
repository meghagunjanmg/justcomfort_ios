import axios from "axios";
import { GET_POSTS , ADD_POSTS , DELETE_POSTS , POSTS_LOADING} from "./types";


export const getPosts = () => dispatch => 
{
    dispatch(setPostsLoading());
    axios.get("/api/items/getPosts")
        .then(res => dispatch({type:GET_POSTS , payload:res.data}))
    //this return is going to the postReducer.js and would give value to action
    // return{
    //     type:GET_POSTS
    // };
};
export const deletePost = (id) => dispatch => 
{
    axios.delete(`/api/items/deletePosts/${id}`)
        .then(res => dispatch({type:DELETE_POSTS,payload:id}))
    //this return is going to the postReducer.js and would give value to action
    // return{
    //     type:DELETE_POSTS,
    //     payload: id
    // };
};
export const addPost = (newPost) => dispatch => 
{
    //Here Payload receives the new post added by Backend
    axios.post("/api/items/addNewPost", newPost)
    .then(res => dispatch({ type:ADD_POSTS , payload:res.data }))
    //this return is going to the postReducer.js and would give value to action
    // return{
    //     type:ADD_POSTS,
    //     payload:newPost
    // };
};

export const setPostsLoading = () => {
    return{
        type: POSTS_LOADING
    }
}