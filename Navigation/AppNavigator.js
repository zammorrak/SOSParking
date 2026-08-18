import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MapScreen from "../Screens/MapScreen";
import AboutUsScreen from "../Screens/AboutUsScreen";
import DetailScreen from "../Screens/DetailScreen";
import RuleScreen from "../Screens/RuleScreen";
import UsefulLinkScreen from "../Screens/UsefulLinkScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HeaderMenuMapLinks({ navigation }) {
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

function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="MapTab"
                component={MapScreen}
                options={{ title: 'Carte' }}
            />
            <Tab.Screen
                name="RuleTab"
                component={RuleScreen}
                options={{ title: 'Règles' }}
            />
            <Tab.Screen
                name="UsefulTab"
                component={UsefulLinkScreen}
                options={{ title: 'Liens utiles' }}
            />
        </Tab.Navigator>
    );
}

function MainStackNavigator() {
    return (
        <Stack.Navigator
            id="RootStack"
            initialRouteName="MainTabs"
            screenOptions={{
                headerStyle: { backgroundColor: '#6200ee' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="MainTabs"
                component={MainTabNavigator}
                options={({ navigation }) => ({
                    title: 'SOS Parking',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={{ marginRight: 15 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>☰</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => <HeaderMenuMapLinks navigation={navigation} />,
                })}
            />
            <Stack.Screen
                name="DetailScreen"
                component={DetailScreen}
                options={{ title: 'Détails' }}
            />
            <Stack.Screen
                name="AboutUsScreen"
                component={AboutUsScreen}
                options={({ navigation }) => ({
                    title: 'À propos de nous',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={{ marginRight: 15 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>☰</Text>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="RuleScreen"
                component={RuleScreen}
                options={({ navigation }) => ({
                    title: 'Règles',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={{ marginRight: 15 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>☰</Text>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="UsefulScreen"
                component={UsefulLinkScreen}
                options={({ navigation }) => ({
                    title: 'Liens utiles',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={{ marginRight: 15 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>☰</Text>
                        </TouchableOpacity>
                    ),
                })}
            />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    drawerActiveTintColor: '#6200ee',
                }}
            >
                <Drawer.Screen
                    name="Accueil"
                    component={MainStackNavigator}
                />
                <Drawer.Screen
                    name="À propos"
                    component={MainStackNavigator}
                    listeners={({ navigation }) => ({
                        drawerItemPress: (e) => {
                            e.preventDefault();
                            navigation.closeDrawer();
                            navigation.navigate('Accueil', { screen: 'AboutUsScreen' });
                        },
                    })}
                />
                <Drawer.Screen
                    name="Règles de stationnement"
                    component={MainStackNavigator}
                    listeners={({ navigation }) => ({
                        drawerItemPress: (e) => {
                            e.preventDefault();
                            navigation.closeDrawer();
                            navigation.navigate('Accueil', { screen: 'RuleScreen' });
                        },
                    })}
                />
                <Drawer.Screen
                    name="Liens utiles"
                    component={MainStackNavigator}
                    listeners={({ navigation }) => ({
                        drawerItemPress: (e) => {
                            e.preventDefault();
                            navigation.closeDrawer();
                            navigation.navigate('Accueil', { screen: 'UsefulScreen' });
                        },
                    })}
                />
            </Drawer.Navigator>
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