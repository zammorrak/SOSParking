import {View, StyleSheet, Dimensions, ActivityIndicator, Text, Pressable, Switch} from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import { GetDistanceInKm } from "../Utils/Utils";
import NotificationCmp from "./NotificationCmp";
import Slider from "@react-native-community/slider";

export default function Map() {
    const navigation = useNavigation();
    const mapRef = useRef(null);

    const [closeDistanceNotif, setCloseDistanceNotif] = useState(0.1);
    const [rangeMarkerColor, setRangeMarkerColor] = useState(0.25);
    const [devStep, setDevStep] = useState(0.0008);
    const [userLocation, setUserLocation] = useState(null);
    const [parkingData, setParkingData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLocationLoaded, setIsLocationLoaded] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);
    const [isUsingDevLocation, setIsUsingDevLocation] = useState(false);
    const [isDevMode, setIsDevMode] = useState(false);

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
                    if (isDevMode && isUsingDevLocation) return;
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
    }, [isDevMode, isUsingDevLocation]);

    const isInRangeMarker = (lat1, lon1, lat2, lon2) => {
        if (!lat2 || !lon2) return false;
        let distance = GetDistanceInKm(lat1, lon1, lat2, lon2);
        return distance < rangeMarkerColor;
    };

    const toggleDevMode = async (value) => {
        setIsDevMode(value);

        if (value) {
            setIsUsingDevLocation(true);
            return;
        }
        setIsUsingDevLocation(false);

        try {
            const realLoc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = realLoc.coords;
            const realPosition = { latitude, longitude };

            setUserLocation(realPosition);

            coordinate.timing({
                latitude,
                longitude,
                duration: 250,
                useNativeDriver: false,
            }).start();

            mapRef.current?.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 250);
        } catch (e) {
            console.log("Erreur récupération position réelle:", e);
        }
    };

    const moveDevLocation = (deltaLat, deltaLon) => {
        if (!isDevMode || !userLocation) return;

        const newLocation = {
            latitude: userLocation.latitude + deltaLat,
            longitude: userLocation.longitude + deltaLon,
        };

        setIsUsingDevLocation(true);
        setUserLocation(newLocation);

        coordinate.timing({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            duration: 200,
            useNativeDriver: false,
        }).start();

        mapRef.current?.animateToRegion({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 250);
    };

    const isLoading = !isDataLoaded || !isLocationLoaded || !isMapReady;

    return (
        <View style={styles.container}>
            {userLocation && (
                <NotificationCmp userLocation={userLocation} parkingData={parkingData} thresHoldKm={closeDistanceNotif} />
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

            {isDevMode && (
                <View style={styles.devPadContainer}>
                    <Text style={styles.devTitle}>DEV MODE</Text>

                    <Pressable style={styles.devBtn} onPress={() => moveDevLocation(devStep, 0)}>
                        <Text style={styles.devBtnText}>↑</Text>
                    </Pressable>

                    <View style={styles.devMiddleRow}>
                        <Pressable style={styles.devBtn} onPress={() => moveDevLocation(0, -devStep)}>
                            <Text style={styles.devBtnText}>←</Text>
                        </Pressable>
                        <Pressable style={styles.devBtn} onPress={() => moveDevLocation(0, devStep)}>
                            <Text style={styles.devBtnText}>→</Text>
                        </Pressable>
                    </View>

                    <Pressable style={styles.devBtn} onPress={() => moveDevLocation(-devStep, 0)}>
                        <Text style={styles.devBtnText}>↓</Text>
                    </Pressable>

                    <View style={styles.devSliderWrap}>
                        <Text style={styles.devSliderLabel}>
                            Distance: {(devStep * 111000).toFixed(0)} m
                        </Text>
                        <Slider
                            style={styles.devSlider}
                            minimumValue={0.0001}
                            maximumValue={0.05}
                            step={0.0001}
                            value={devStep}
                            onValueChange={setDevStep}
                            minimumTrackTintColor="#34C759"
                            maximumTrackTintColor="#8E8E93"
                            thumbTintColor="#FFFFFF"
                        />
                    </View>
                </View>
            )}

            <View style={styles.devSwitchContainer}>
                <Text style={styles.devSwitchLabel}>Mode DEV</Text>
                <Switch
                    value={isDevMode}
                    onValueChange={toggleDevMode}
                    trackColor={{ false: "#767577", true: "#34C759" }}
                    thumbColor={isDevMode ? "#FFFFFF" : "#f4f3f4"}
                />
            </View>

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
    devPadContainer: {
        position: 'absolute',
        right: 20,
        bottom: 120,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderRadius: 12,
        padding: 10,
        gap: 8,
    },
    devTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
        marginBottom: 2,
    },
    devMiddleRow: {
        flexDirection: 'row',
        gap: 8,
    },
    devBtn: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#1f1f1f',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    devBtnText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },
    devSwitchContainer: {
        position: "absolute",
        top: 55,
        right: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(28, 28, 30, 0.9)",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        zIndex: 1000,
    },
    devSwitchLabel: {
        color: "#fff",
        fontWeight: "600",
        marginRight: 8,
    },
    devSliderWrap: {
        width: 150,
        marginTop: 4,
    },
    devSliderLabel: {
        color: "#fff",
        fontSize: 11,
        marginBottom: 4,
        textAlign: "center",
    },
    devSlider: {
        width: "100%",
        height: 24,
    },
});