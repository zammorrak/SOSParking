import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { File, Paths } from 'expo-file-system';

export default function Camera({ parkingId, onPhotoSaved }) {
    const isFocused = useIsFocused();
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState(null);
    const cameraRef = useRef(null);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>L'accès à la caméra est requis.</Text>
                <TouchableOpacity style={styles.btnPrimary} onPress={requestPermission}>
                    <Text style={styles.btnText}>Autoriser la caméra</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
            setPhotoUri(photo.uri);
        }
    };

    const handleRetake = () => {
        setPhotoUri(null);
    };

    const handleConfirm = async () => {
        try {
            const photoFile = new File(photoUri);
            const destination = new File(Paths.document, `parking_${parkingId}.jpg`);
            console.log(destination.uri);
            if (destination.exists) {
                destination.delete();
            }
            photoFile.move(destination);
            if (onPhotoSaved) {
                onPhotoSaved(destination);
            }
            Alert.alert("Succès !", "La photo du parking a été enregistrée.");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
            Alert.alert("Erreur", "Impossible de sauvegarder la photo.");
        }
    };

    if (photoUri) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
                <SafeAreaView style={styles.confirmationOverlay}>
                    <View style={styles.confirmationButtons}>
                        <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={handleRetake}>
                            <Text style={styles.btnText}>Recommencer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={handleConfirm}>
                            <Text style={styles.btnText}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isFocused && (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="back"
                    ref={cameraRef}
                />
            )}
            <SafeAreaView style={styles.cameraOverlay}>
                <View style={styles.captureContainer}>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.innerCaptureButton} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    permissionText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        color: '#000',
    },
    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    captureContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    captureButton: {
        width: 75,
        height: 75,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCaptureButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    previewImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    confirmationOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },
    confirmationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    btn: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        elevation: 3,
    },
    btnCancel: {
        backgroundColor: '#ef4444',
    },
    btnConfirm: {
        backgroundColor: '#22c55e',
    },
    btnPrimary: {
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});