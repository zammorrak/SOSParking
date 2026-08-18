import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from "react-native";
import MapView, { AnimatedRegion, Marker, UrlTile } from "react-native-maps";
import {useEffect, useRef, useState} from "react";
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import { GetDistanceInKm } from "../Utils/Utils";
import NotificationCmp from "./NotificationCmp";

export default function Map() {
    let closeDistance = 48.44;

    const navigation = useNavigation();

    const INITIAL_REGION = {
        latitude: 45.50884,
        longitude: -73.58781,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    const coordinate = useRef(
        new AnimatedRegion({
            latitude: INITIAL_REGION.latitude,
            longitude: INITIAL_REGION.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        })
    ).current;

    const [userLocation, setUserLocation] = useState({
        latitude: INITIAL_REGION.latitude,
        longitude: INITIAL_REGION.longitude,
    });

    const [parkingData, setParkingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=32821ddd-d893-41ff-9d02-ea94fbc6c930&limit=50");
                const json = await response.json();
                if (json.success && json.result) {
                    setParkingData(json.result.records);
                }
            } catch (err) {
                console.log("Erreur Fetch:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let subscription = null;

        const StartTracking = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                (location) => {
                    const { latitude, longitude } = location.coords;
                    coordinate.timing({
                        latitude,
                        longitude,
                        duration: 500,
                        useNativeDriver: false
                    }).start();
                    setUserLocation({ latitude, longitude });
                }
            );
        };
        StartTracking();

        return () => {
            if (subscription) subscription.remove();
        };
    }, []);

    const isInRangeMarker = (lat1, lon1, lat2, lon2) => {
        let distance = GetDistanceInKm(lat1, lon1, lat2, lon2);
        return distance < closeDistance;
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION}
                mapType="standard"
            >

                <Marker.Animated coordinate={coordinate}>
                    <View style={styles.dot} />
                </Marker.Animated>

                {parkingData.map((parking, index) => {
                    const lat = parseFloat(parking.nLatitude);
                    const lon = parseFloat(parking.nLongitude);

                    if (isNaN(lat) || isNaN(lon)) return null;

                    const isInRange = isInRangeMarker(lat, lon, userLocation.latitude, userLocation.longitude);
                    return (
                        <Marker
                            key={`${parking._id}-${isInRange}`}
                            coordinate={{ latitude: lat, longitude: lon }}
                            title={parking.nom || "Stationnement"}
                            description={parking.adresse || ""}
                            pinColor={isInRange ? "red" : "yellow"}
                            onPress={() => {
                                navigation.navigate('DetailScreen', { parkingData: parking, userLoc: userLocation });
                            }}
                        />
                    );
                })}
            </MapView>
            <View style={styles.legendContainer}>
                <Text>Red color = in range</Text>
                <Text>Yellow color = out range</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { justifyContent: 'center', alignItems: 'center' },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    dot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#FF3B30',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    legendContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 8,
    }
});