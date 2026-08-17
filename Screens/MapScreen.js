import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Map from "../Components/Map";

export default function MapScreen() {
    /*const [parkingData, setParkingData]= useState([])
    const [loading, setLoading]= useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=32821ddd-d893-41ff-9d02-ea94fbc6c930");
                const json = await response.json();
                if(json.success && json.result){
                    setParkingData(json.result.records);
                    console.log(parkingData);
                }
            }catch(err){
                console.log(err);
            }finally {
                setLoading(false);
            }
        };
        fetchData().then(r => console.log("Data fetched successfully")).catch(err => console.log(err));
    }, []);*/

    return (
        <View style={styles.container}>
            <Map />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});