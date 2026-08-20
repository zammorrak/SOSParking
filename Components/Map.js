import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import { GetDistanceInKm } from "../Utils/Utils";
import NotificationCmp from "./NotificationCmp";

export default function Map() {
    let closeDistance = 48.44;
    const navigation = useNavigation();
    const mapRef = useRef(null);

    const [userLocation, setUserLocation] = useState(null);
    const [parkingData, setParkingData] = useState([]);

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLocationLoaded, setIsLocationLoaded] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);

    const coordinate = useRef(new AnimatedRegion({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    })).current;

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
                setIsDataLoaded(true);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let subscription = null;

        const startTracking = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setIsLocationLoaded(true);
                return;
            }

            const initialLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = initialLocation.coords;

            coordinate.setValue({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            setUserLocation({ latitude, longitude });
            setIsLocationLoaded(true);

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

        startTracking();

        return () => {
            if (subscription) subscription.remove();
        };
    }, []);

    const isInRangeMarker = (lat1, lon1, lat2, lon2) => {
        if (!lat2 || !lon2) return false;
        let distance = GetDistanceInKm(lat1, lon1, lat2, lon2);
        return distance < closeDistance;
    };

    const isLoading = !isDataLoaded || !isLocationLoaded || !isMapReady;

    return (
        <View style={styles.container}>
            {userLocation && (
                <NotificationCmp userLocation={userLocation} parkingData={parkingData} thresHoldKm={100000} />
            )}

            <MapView
                ref={mapRef}
                style={styles.map}
                onMapReady={() => setIsMapReady(true)}
                initialRegion={
                    userLocation
                        ? {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }
                        : {
                            latitude: 45.50884,
                            longitude: -73.58781,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }
                }
                mapType="standard"
            >
                {userLocation && (
                    <Marker.Animated coordinate={coordinate}>
                        <View style={styles.dot} />
                    </Marker.Animated>
                )}

                {parkingData.map((parking) => {
                    const lat = parseFloat(parking.nLatitude);
                    const lon = parseFloat(parking.nLongitude);

                    if (isNaN(lat) || isNaN(lon)) return null;

                    const isInRange = userLocation
                        ? isInRangeMarker(lat, lon, userLocation.latitude, userLocation.longitude)
                        : false;

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

            <View style={styles.legendDark}>
                <View style={styles.legendItem}>
                    <View style={[styles.colorDot, { backgroundColor: '#FF3B30' }]} />
                    <Text style={styles.legendDarkText}>À portée</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.colorDot, { backgroundColor: '#FFCC00' }]} />
                    <Text style={styles.legendDarkText}>Hors portée</Text>
                </View>
            </View>

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Chargement de la carte...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    legendDark: {
        position: 'absolute',
        bottom: 35,
        left: 20,
        backgroundColor: 'rgba(28, 28, 30, 0.85)',
        borderRadius: 10,
        padding: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    legendDarkText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});