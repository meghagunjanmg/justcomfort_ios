import React from "react";
import AsyncStorage from '@react-native-community/async-storage';

// create a function that saves your data asyncronously
const _storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log("Error saving data in Asyncstorage..");
    }
}

// fetch the data back asyncronously
const _retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // Our data is fetched successfully
            console.log("values are from storage data >>> " + key + value);
            return value;
        }
    } catch (error) {
        // Error retrieving data
    }
}

export { _storeData, _retrieveData};