import {ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
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
        if (parkingData?.nLatitude && parkingData?.nLongitude) {
            getAddress(parkingData?.nLatitude, parkingData?.nLongitude);
        }
        if (destination.exists) {
            setSavedPhoto(destination.uri)
        }
    }, [])

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

    const distance = GetDistanceInKm(parkingData?.nLatitude, parkingData?.nLongitude, userLoc?.latitude, userLoc?.longitude);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Détails du Stationnement</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Adresse principale</Text>
                <Text style={styles.addressText}>{address}</Text>

                {distance && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{distance} KM</Text>
                    </View>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Informations complémentaires</Text>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>ID Place</Text>
                    <Text style={styles.rowValue}>{parkingData?._id}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Numéro de place</Text>
                    <Text style={styles.rowValue}>{parkingData?.sNoPlace || 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Rue</Text>
                    <Text style={styles.rowValue}>{parkingData?.sNomRue || 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Type d'exploitation</Text>
                    <Text style={styles.rowValue}>{parkingData?.sTypeExploitation || 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Coordonnées</Text>
                    <Text style={styles.rowValue}>{parkingData?.nLatitude}, {parkingData?.nLongitude}</Text>
                </View>
            </View>

            {currentPhotoUri && (
                <View style={styles.imageCard}>
                    <Image source={{ uri: currentPhotoUri }} style={styles.image} />
                    <TouchableOpacity style={styles.deleteButton} onPress={HandleErasePicture}>

                        <Text style={styles.deleteButtonText}>Effacer la photo</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View>
                <TouchableOpacity style={styles.primaryButton} onPress={() => setTakePicture(true)}>
                    <Text style={styles.primaryButtonText}>Prendre une photo</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        marginBottom : 30
    },
    contentContainer: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    fullScreen: {
        flex: 1,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1D1E',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1D1E',
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        color: '#8E8E93',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 16,
        color: '#2C3E50',
        lineHeight: 22,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8F1FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 10,
    },
    badgeText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 13,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    rowLabel: {
        color: '#6C757D',
        fontSize: 14,
    },
    rowValue: {
        color: '#1A1D1E',
        fontWeight: '500',
        fontSize: 14,
        maxWidth: '60%',
        textAlign: 'right',
    },
    imageCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 8,
        marginBottom: 12,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});