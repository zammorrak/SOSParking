import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import de tes écrans
import MapScreen from "../Screens/MapScreen";
import AboutUsScreen from "../Screens/AboutUsScreen";
import DetailScreen from "../Screens/DetailScreen";
import RuleScreen from "../Screens/RuleScreen";
import UsefulLinkScreen from "../Screens/UsefulLinkScreen";

const Stack = createNativeStackNavigator();

// Composant avec les 3 liens du Menu
function HeaderMenuLinks({ navigation }) {
    return (
        <View style={styles.menuContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('AboutUsScreen')}
                style={styles.linkButton}
            >
                <Text style={styles.linkText}>À propos</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('RuleScreen')}
                style={styles.linkButton}
            >
                <Text style={styles.linkText}>Règles</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('UsefulScreen')}
                style={styles.linkButton}
            >
                <Text style={styles.linkText}>Liens utiles</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                id="RootStack"
                initialRouteName="MapScreen"
                screenOptions={{
                    headerStyle: { backgroundColor: '#6200ee' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                {/* Écran principal avec les liens dans le Header */}
                <Stack.Screen
                    name="MapScreen"
                    component={MapScreen}
                    options={({ navigation }) => ({
                        title: 'Map',
                        headerRight: () => <HeaderMenuLinks navigation={navigation} />,
                    })}
                />

                {/* Écrans secondaires */}
                <Stack.Screen
                    name="DetailScreen"
                    component={DetailScreen}
                    options={{ title: 'Détails' }}
                />
                <Stack.Screen
                    name="AboutUsScreen"
                    component={AboutUsScreen}
                    options={{ title: 'À propos de nous' }}
                />
                <Stack.Screen
                    name="RuleScreen"
                    component={RuleScreen}
                    options={{ title: 'Règles' }}
                />
                <Stack.Screen
                    name="UsefulScreen"
                    component={UsefulLinkScreen}
                    options={{ title: 'Liens utiles' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkButton: {
        marginLeft: 12,
    },
    linkText: {
        color: '#38BDF8',
        fontWeight: '600',
        fontSize: 13,
    },
});