import { StyleSheet, View, Dimensions } from 'react-native';
import Map from "../Components/Map";

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Map />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});