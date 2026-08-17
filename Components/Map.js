import {View, StyleSheet, Dimensions} from "react-native";
import MapView, {AnimatedRegion, Marker} from "react-native-maps";
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import {useNavigation} from "@react-navigation/native";

export default function Map() {
    const navigation = useNavigation();

    const [coordinate] = useState(
        new AnimatedRegion({
            latitude: 45.50884,
            longitude: -73.58781,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        })
    );
    const [parkingData, setParkingData]= useState([])
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
    }, []);

    useEffect(() => {
        let subscription = null

        const StartTracking = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

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
                    }).start();
                }
            );
        };
        StartTracking();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    })
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 45.50884,
                    longitude: -73.58781,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker.Animated coordinate={coordinate}>
                    <View style={styles.dot} />
                </Marker.Animated>
                {parkingData.map((parking, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: parseFloat(parking.nLatitude),
                            longitude: parseFloat(parking.nLongitude),
                        }}
                        title={parking.nom}
                        description={parking.adresse}
                        onPress={() => {navigation.navigate('DetailScreen', { parkingData: parking, userLoc: coordinate })}}
                    />
                ))}
            </MapView>
        </View>
    )
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
});