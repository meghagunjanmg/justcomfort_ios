import React, { Component, useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, Button, StyleSheet, Dimensions  } from 'react-native';
import MapView from "react-native-maps";
import * as Location from 'expo-location';

export default class RewardsScreen extends Component {
  
  state = {
    loading: true,
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    isMapReady: false,
    marginTop: 1,
    userLocation: "",
    regionChangeProgress: false
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        this.setState({
          locationResult: 'Permission to access location was denied',
        });
      } else {
        this.setState({ hasLocationPermissions: true });
      }
  
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ locationResult: JSON.stringify(location) });
      
      // Center the map on the location we just fetched.
      this.setState({
          mapRegion: { 
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421 
          },
          loading: false,
          error: null,});
  };

  onMapReady = () => {
    this.setState({ isMapReady: true, marginTop: 0 });
  }

  // Fetch location details as a JOSN from google map API
  fetchAddress = () => {
    fetch("http://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.mapRegion.latitude + "," + this.state.mapRegion.longitude + "&key=" + "AIzaSyCKabiwGyic2E7QicGIz2Fs_D81DCnWb1Y")
      .then((response) => response.json())
      .then((responseJson) => {
        const userLocation = responseJson.results[0].formatted_address;
        this.setState({
          userLocation: userLocation,
          regionChangeProgress: false
        });
      });
  }

  // Update state on region change
  onRegionChange = mapRegion => {
    this.setState({
      mapRegion,
      regionChangeProgress: true
    }, () => this.fetchAddress());
  }

  // Action to be taken after select location button click
  onLocationSelect = () => alert(this.state.userLocation);

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            {!!this.state.mapRegion.latitude && !!this.state.mapRegion.longitude &&
              <MapView
                style={{ ...styles.map, marginTop: this.state.marginTop }}
                initialRegion={this.state.mapRegion}
                showsUserLocation={true}
                onMapReady={this.onMapReady}
                onRegionChangeComplete={this.onRegionChange}
              >
                   <MapView.Marker
                        coordinate={{ "latitude": this.state.mapRegion.latitude, "longitude": this.state.mapRegion.longitude }}
                        title={"Your Location"}
                        draggable
                    /> 
                    </MapView>
            }

            {/*<View style={styles.mapMarkerContainer}>
              <Text style={{ fontFamily: 'fontawesome', fontSize: 42, color: "#ad1f1f" }}>&#xf041;</Text>
            </View>*/}
          </View>
          <View style={styles.deatilSection}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>Set your current address</Text>
            <Text style={{ fontSize: 10, color: "#999" }}>LOCATION</Text>
            <Text numberOfLines={2} style={{ fontSize: 14, paddingVertical: 10, borderBottomColor: "silver", borderBottomWidth: 0.5 }}>
              {!this.state.regionChangeProgress ? this.state.userLocation : "Identifying Location..."}</Text>
            <View style={styles.btnContainer}>
              <Button
                title="PICK THIS LOCATION"
                disabled={this.state.regionChangeProgress}
                onPress={this.onLocationSelect}
              >
              </Button>
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
    container: {
      display: "flex",
      height: Dimensions.get("screen").height,
      width: Dimensions.get("screen").width
    },
    map: {
      flex: 1
    },
    mapMarkerContainer: {
      left: '47%',
      position: 'absolute',
      top: '42%'
    },
    mapMarker: {
      fontSize: 40,
      color: "red"
    },
    deatilSection: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 10,
      display: "flex",
      justifyContent: "flex-start"
    },
    spinnerView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    btnContainer: {
      width: Dimensions.get("window").width - 20,
      position: "absolute",
      bottom: "50%",
      left: 10
    }
  });