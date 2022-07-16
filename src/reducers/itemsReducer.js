import { GET_ITEMS, GET_LOCATION,GET_COUPONDISCOUNT, GET_ORDERFEILDS,GET_HOMESCREENDATA,GET_DELIVERYDATA, UPDATE_CART, GET_USERDATA, UPDATE_USER_DETAILS,GET_CATEGORIESDATA,GET_USERORDER,GET_USERPASTORDER,GET_STOREID,GET_USERADDRESS,GET_NOTIFYBY,UPDATE_NOTIFYBY, GET_CURRENCY,GET_ALLPRODUCTS, POSTS_LOADING} from "../actions/types";
import {_storeData, _retrieveData} from "../activity/Storage";
const initialState = {
    userdata:{},
    homepageData:{
        status: "0" ,
        message: "",
        banner1: [],
        banner2: [],
        top_selling: [],
        recent_selling:[],
        whats_new: [],
        deal_products: [],
        top_category: []
    },
    storeId:null,
    allProductsData:[],
    notifyByData:{},
    userAddressData:[],
    userOrderData:[],
    userPastOrderData:[],
    categoriesData:[],
    deliveryData:{},
    cartItems:[],
    latitude:null,
    longitude:null,
    itemsData: [],
    currency_name: "",
    currency_sign: "",
    couponDiscount:{
        couponName:null,
        discount:0,
        couponApplied:false
    },
    status:"",
    orderFeildsData:{},
    loading: false
}


export default function (state = initialState, action)
{
    switch(action.type)
    {
        case GET_ALLPRODUCTS:
            console.log("Get all Products Reducer called with data:- " + action.payload.allProductsData[0])
            return{
                ...state,
                allProductsData:action.payload.allProductsData,
                loading:false
            }
        case GET_COUPONDISCOUNT:
            console.log("Get Coupon discount reducer" )
            return{
                ...state,
                couponDiscount:action.payload.data,
                loading:false
            }
        case GET_USERDATA:
            return{
                ...state,
                userdata:action.payload.userData,
                loading: false
            }
        case UPDATE_USER_DETAILS:
            return{
                ...state,
                userdata:action.payload.userDetails,
                loading: false
            }
        case GET_CATEGORIESDATA:
            console.log(`Get Categories Data reducer called`);
            return{
                ...state,
                categoriesData:action.payload.categoriesData,
                loading: false
            }    
        case GET_CURRENCY:
            console.log(`currency reducer called ${action.payload.currency_name} & ${action.payload.currency_sign}`)
            return{
                ...state,
                currency_name: action.payload.currency_name,
                currency_sign: action.payload.currency_sign,
                loading: false
            };
        case GET_DELIVERYDATA:
            console.log(`delivery data reducer called`)
            return{
                ...state,
                deliveryData:action.payload.data,
                loading: false
            };
        case GET_LOCATION:
            console.log(`location reducer called ${action.payload.latitude} & ${action.payload.longitude}`)
            return{
                ...state,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
                loading: false
            };
        case GET_ITEMS:
            console.log("Get Items Reducer called ")
            return{
                ...state,
                itemsData: action.payload.productResponseData,
                status: action.payload.status,
                loading: false
            };
        case UPDATE_CART:
        {
            console.log(`update cart reducer called`)
            return{
                ...state,
                cartItems:action.payload.cartItemsArray,
                loading:false
            }
            // if(action.payload.type == 'more')
            // {
            //     console.log(state.cartItems);
            //     const index = state.homepageData.recent_selling.findIndex(element => element.description !== action.payload.description); //finding index of the item
            //     for(var i=0;i<state.cartItems.length;i++)
            //     {
            //         if(state.cartItems[i].description == action.payload.description)
            //         {
            //             const newArray = [...state.cartItems]; //making a new array
            //             newArray[index-1].qty = newArray[index-1].qty+1;//changing value in the new array
            //             console.log("If statement is called")
            //             return { 
            //              ...state, //copying the orignal state
            //              cartItems: newArray, //reassingning todos to new array
            //             }
            //         }
            //     }
            //     console.log("outer statement is called")
            //     var data = state.homepageData.recent_selling[index-1];
            //     data.qty = data.qty+1;
            //     return{...state,cartItems:data};
                
                
            //     // for(var i=0 ; i <state.homepageData.recent_selling.length ; i++)
            //     // {
            //     //     if(state.homepageData.recent_selling[i].description == action.payload.description)
            //     //     {
            //     //         for(j=0;j<state.cartItems.length;j++)
            //     //         {
            //     //             if(cartItems[j].description==action.payload.description)
            //     //             {
                                
            //     //                 return{...state
            //     //                     ,cartItems: newQuantity}
            //     //             }
            //     //         }

            //     //     }
            //     // }
            // }
            // else if(action.payload.type == 'less')
            // {
            //     console.log(state.cartItems);
            // }
        }
            
        case GET_HOMESCREENDATA:
            console.log(`Get homescreen data reducer with loading:- ${state.loading}`);
            return{
                ...state,
                homepageData:{
                    status:  action.payload.status,
                    message: action.payload.message,
                    banner1: action.payload.banner1,
                    banner2: action.payload.banner2,
                    top_selling: action.payload.top_category,
                    recent_selling:action.payload.recent_selling,
                    whats_new: action.payload.whats_new,
                    deal_products: action.payload.deal_products,
                    top_category: action.payload.top_category
                },
                loading:false
            };
        case GET_USERORDER:
            console.log("Get User Orders reducer called")
            return{
                ...state,
                userOrderData:action.payload.userOrderData,
                loading: false
            }
        case GET_USERPASTORDER:
            console.log("Get User Past Orders reducer called")
            return{
                ...state,
                userPastOrderData:action.payload.userPastOrderData,
                loading: false
            }
        case GET_ORDERFEILDS:
            console.log("Get Order Feilds Data reducer called")
            return{
                ...state,
                orderFeildsData:action.payload.data,
                loading: false
            }
        case GET_USERADDRESS:
            console.log("Get User Address reducer called")
            return{
                ...state,
                userAddressData:action.payload.userAddressData,
                loading: false
            }
        case GET_NOTIFYBY:
            console.log("Get Notify By Reducer Called");
            return {
                ...state,
                notifyByData:action.payload.notifyByData,
                loading: false
            }  
        case UPDATE_NOTIFYBY:
            console.log("Update Notify By Reducer Called");
            return {
                ...state,
                notifyByData:action.payload.notifyByData,
                loading: false
            }  
        case GET_STOREID:
        console.log("Store Id Reducer Called");
        return {
            ...state,
            storeId:action.payload.storeId,
            loading: false
        }      
        case POSTS_LOADING:
            console.log(`post loading reducer called with value:- ${state.loading}`);
        return{
            ...state,
            loading:true
        } 
        
        default:
            return state;
    }
}