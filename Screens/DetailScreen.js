import {ActivityIndicator, Button, Image, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import Camera from "../Components/Camera";
import { File, Paths } from 'expo-file-system';
import {GetDistanceInKm} from '../Utils/Utils'


export default function DetailScreen({ route }) {
    const [takePicture, setTakePicture] = useState(false);
    const [address, setAddress] = useState('');
    const [savedPhoto, setSavedPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const parkingData = route.params?.parkingData;
    const userLoc = route.params?.userLoc;
    const destination = new File(Paths.document, `parking_${parkingData._id}.jpg`);

    const currentPhotoUri = savedPhoto || (destination.exists ? `${destination.uri}?t=${Date.now()}` : null);
    useEffect(() => {
        getAddress(parkingData?.nLatitude, parkingData?.nLongitude);
        if (destination.exists) {
            setSavedPhoto(destination.uri)
        }
    })

    const HandleErasePicture = () => {
        if (destination.exists) {
            destination.delete();
            setSavedPhoto(null);
        }
    }

    const handlePhotoSaved = (file) => {
        const updatedUri = `${file.uri}?t=${Date.now()}`;
        setSavedPhoto(updatedUri);
        setTakePicture(false);
    };

    const getAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                {
                    headers: {
                        'User-Agent': 'MonApplication/1.0 (votre_email@exemple.com)'
                    }
                }
            );
            const data = await response.json();
            setAddress(data.display_name || "Address not found");
        } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Error retrieving address");
        } finally {
            setLoading(false);
        }
    };

    if(loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    if (takePicture) {
        return (
            <View style={styles.fullScreen}>
                <Camera onPhotoSaved={handlePhotoSaved} parkingId={parkingData?._id} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detail</Text>
            <Text>Adresse: {address}</Text>
            <Text>Distance: {GetDistanceInKm(parkingData?.nLatitude, parkingData?.nLongitude, userLoc.latitude, userLoc.longitude)}KM</Text>
            <Text>id: {parkingData._id}</Text>
            <Text>latitude: {parkingData?.nLatitude}</Text>
            <Text>longitude: {parkingData?.nLongitude}</Text>
            <Text>Type Exploitation: {parkingData?.sTypeExploitation}</Text>
            <Text>Nom de rue: {parkingData?.sNomRue}</Text>
            <Text>Numero: {parkingData?.sNoPlace}</Text>
            {currentPhotoUri && (
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image source={{ uri: currentPhotoUri }} style={styles.image} />
                    <Button title={"Effacer"} onPress={HandleErasePicture} />
                </View>
            )}
            <View style={styles.buttonContainer}>
                <Button title={"Prendre photo"} onPress={() => setTakePicture(true)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    fullScreen: {
        flex: 1,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
    image: {
        width: '100%',
        height: 500,
        borderRadius: 8,
        marginVertical: 15,
        resizeMode: 'contain',
    },
});