import {createAppContainer, createDrawerNavigator,} from 'react-navigation';

import Home from "../activity/Home";
import Category from "../activity/Category";
import Search from "../activity/Search";
import Rewards from "../activity/Rewards";
import Cart from "../activity/Cart";


const HamburgerNavigation = createDrawerNavigator(
    {
        Home: {
            screen: Home,
        },
        Category: Category,
        Search:Search,
        Rewards:Rewards,
        Cart:Cart
    },
    {
        initialRouteName: "Home",
        
    }
 );

 export default createAppContainer(HamburgerNavigation);