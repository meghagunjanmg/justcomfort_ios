import axios from "axios";
import { 
  GET_ITEMS,
  GET_LOCATION,
  UPDATE_CART,
  GET_HOMESCREENDATA,
  UPDATE_USER_DETAILS,
  GET_USERDATA,
  GET_CATEGORIESDATA,
  POSTS_LOADING,
  GET_USERPASTORDER,
  GET_USERADDRESS,
  GET_NOTIFYBY,
  UPDATE_NOTIFYBY,
  GET_CURRENCY,
  GET_USERORDER,
  GET_DELIVERYDATA,
  GET_STOREID,
  GET_ALLPRODUCTS,
  GET_ORDERFEILDS,
  GET_COUPONDISCOUNT
} from "./types";

export const getCouponDiscount = (data) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log("Get Coupon Discount action called");
  await dispatch({
    type:GET_COUPONDISCOUNT,
    payload:{
      data:data
    }
  })
}

export const getAllProducts = (data) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log("Get All Products data Reducer Called");
  await dispatch({
    type:GET_ALLPRODUCTS,
    payload:{
      allProductsData:data
    }
  })
}
export const getUserData = (data) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log(`Get User Data Action called with data:- ${data}`)
  await dispatch({
    type:GET_USERDATA,
    payload:{
      userData:data
    }
  })
}
export const updateUserdetails = (data) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log(`Update User Details Action called with data:- ${data}`)
  await dispatch({
    type:UPDATE_USER_DETAILS,
    payload:{
      userDetails:data
    }
  })
}
export const getCategoriesData = (data) => async dispatch => {
  dispatch(setPostsLoading());
  console.log("Get Categories Action called");
  await dispatch ({
    type:GET_CATEGORIESDATA,
    payload:{
      categoriesData:data
    }
  })
}
export const getLocation = (latitude,longitude) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log("Location action Called ");
  await dispatch({
    type:GET_LOCATION , 
    payload:
    {
      latitude: latitude,
      longitude: longitude
    }})
}
export const getItems = (productResponseStatus,productResponseData) => async dispatch => 
{
    dispatch(setPostsLoading());
    console.log("called in getItems action");
    await dispatch({type:GET_ITEMS , 
      payload:{
          productResponseData: productResponseData,
          status: productResponseStatus
      }})
    // axios.get("/api/items/getPosts")
    //     .then(res => dispatch({type:GET_POSTS , payload:res.data}))
    //this return is going to the postReducer.js and would give value to action
    // return{
    //     type:GET_POSTS
    // };
}
export const updatedCart = (cartItemsArray,partOf,description) => async dispatch =>{
  dispatch(setPostsLoading());
  console.log("Update cart action Called ");
  await dispatch({
    type:UPDATE_CART , 
    payload:
    {
      cartItemsArray:cartItemsArray,
      partOf:partOf,
      description:description
    }})
}
export const getHomescreenData = (status,message,banner1,banner2,top_selling,recent_selling,whats_new,deal_products,top_category) => async dispatch =>
{
  dispatch(setPostsLoading());
  console.log("Update Homescreen data action Called ");
  dispatch({
                type:GET_HOMESCREENDATA , 
                payload:
                {
                  status: status,
                  message: message,
                  banner1: banner1,
                  banner2: banner2,
                  top_selling: top_selling,
                  recent_selling: recent_selling,
                  whats_new: whats_new,
                  deal_products: deal_products,
                  top_category: top_category
                }})
  
}
export const getUserOrders = (data) => async dispatch => 
{
    dispatch(setPostsLoading());
    console.log("Get User Orders action called");
    await dispatch({type:GET_USERORDER , 
      payload:{
          userOrderData:data
      }})

}
export const getUserPastOrders = (data) => async dispatch => 
{
    dispatch(setPostsLoading());
    console.log("Get User Past Orders action called");
    await dispatch({type:GET_USERPASTORDER , 
      payload:{
          userPastOrderData:data
      }})

}
export const getUserAddress = (data) => async dispatch =>
{
  dispatch(setPostsLoading());
  console.log("Get User Address Called with data:-"+data);
  await dispatch({type:GET_USERADDRESS,
    payload:{
      userAddressData:data
    }
  })
}
export const getOrderDetailsData = (data) => async dispatch => 
{
    dispatch(setPostsLoading());
    console.log("Get Orders Detaisl action called");
    await dispatch({type:GET_ORDERFEILDS , 
      payload:{
          data:data
      }})

}
export const getNotifyByData = (data) => async dispatch =>
{
  dispatch(setPostsLoading());
  console.log("Get notify by data Called with data:-"+data);
  await dispatch({type:GET_NOTIFYBY,
    payload:{
      notifyByData:data
    }
  })
}

export const getCurrency = (currency_name, currency_sign) => async dispatch =>
{
  dispatch(setPostsLoading());
  console.log("Get currency for the user:-"+currency_name);
  await dispatch({type:GET_CURRENCY,
    payload:{
      currency_name:currency_name,
      currency_sign: currency_sign
    }
  })
}

export const getDeliveryData = (data) => async dispatch =>
{
  dispatch(setPostsLoading());
  console.log("Get Delivery data action called:-"+data);
  await dispatch({type:GET_DELIVERYDATA,
    payload:{
      data:data
    }
  })
}

export const UpdateNotifyByData = (data) => async dispatch =>
{
  dispatch(setPostsLoading());
  console.log("Update notify by data Called with data:-"+data);
  await dispatch({type:UPDATE_NOTIFYBY,
    payload:{
      notifyByData:data
    }
  })
}
export const getStoreId = (data) => async dispatch =>
{
  dispatch(setPostsLoading());
  console.log("Store Id Action Called with data:-"+data);
  await dispatch({type:GET_STOREID,
    payload:{
      storeId:data
    }
  })
}
export const setPostsLoading = () => {
    return{
        type: POSTS_LOADING
    }
}