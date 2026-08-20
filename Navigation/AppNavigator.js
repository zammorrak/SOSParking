import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MapScreen from '../Screens/MapScreen';
import AboutUsScreen from '../Screens/AboutUsScreen';
import DetailScreen from '../Screens/DetailScreen';
import RuleScreen from '../Screens/RuleScreen';
import UsefulLinkScreen from '../Screens/UsefulLinkScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const ROUTES = {
    ACCUEIL: 'Accueil',
    MAIN_TABS: 'MainTabs',
    MAP: 'MapScreen',
    ABOUT: 'AboutUsScreen',
    RULES: 'RuleScreen',
    USEFUL: 'UsefulLinkScreen',
    DETAIL: 'DetailScreen',
};

function openDrawer(navigation) {
    const parent = navigation.getParent();
    if (parent?.openDrawer) {
        parent.openDrawer();
        return;
    }

    const grandParent = parent?.getParent?.();
    grandParent?.openDrawer?.();
}

function DrawerButton({ navigation }) {
    return (
        <TouchableOpacity onPress={() => openDrawer(navigation)} style={styles.drawerButton}>
            <Text style={styles.drawerIcon}>☰</Text>
        </TouchableOpacity>
    );
}

function HeaderLinks({navigation, hideMap = false, hideAbout = false, hideRules = false, hideUseful = false}) {
    return (
        <View style={styles.menuContainer}>
            {!hideMap && (
                <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.MAP })}
                    style={styles.linkButton}
                >
                    <Text style={styles.linkText}>Carte</Text>
                </TouchableOpacity>
            )}

            {!hideAbout && (
                <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.ABOUT)}
                    style={styles.linkButton}
                >
                    <Text style={styles.linkText}>À propos</Text>
                </TouchableOpacity>
            )}

            {!hideRules && (
                <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.RULES })}
                    style={styles.linkButton}
                >
                    <Text style={styles.linkText}>Règles</Text>
                </TouchableOpacity>
            )}

            {!hideUseful && (
                <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.USEFUL })}
                    style={styles.linkButton}
                >
                    <Text style={styles.linkText}>Liens utiles</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) =>({
                unmountOnBlur: true,
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
                headerStyle: {backgroundColor: '#6200ee'},
                headerTintColor: '#fff',
                headerTitleStyle: {fontWeight: 'bold'},
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    if (route.name === ROUTES.MAP) {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === ROUTES.RULES) {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === ROUTES.USEFUL) {
                        iconName = focused ? 'link' : 'link-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
            })}
        >
            <Tab.Screen
                name={ROUTES.MAP}
                component={MapScreen}
                options={({ navigation }) => ({
                    title: 'SOS Parking',
                    tabBarLabel: 'Carte',
                    headerLeft: () => <DrawerButton navigation={navigation} />,
                    headerRight: () => <HeaderLinks navigation={navigation} hideMap />,
                })}
            />

            <Tab.Screen
                name={ROUTES.RULES}
                component={RuleScreen}
                options={({ navigation }) => ({
                    title: 'Règles',
                    tabBarLabel: 'Règles',
                    headerLeft: () => <DrawerButton navigation={navigation} />,
                    headerRight: () => <HeaderLinks navigation={navigation} hideRules />,
                })}
            />

            <Tab.Screen
                name={ROUTES.USEFUL}
                component={UsefulLinkScreen}
                options={({ navigation }) => ({
                    title: 'Liens utiles',
                    tabBarLabel: 'Liens',
                    headerLeft: () => <DrawerButton navigation={navigation} />,
                    headerRight: () => <HeaderLinks navigation={navigation} hideUseful />,
                })}
            />
        </Tab.Navigator>
    );
}

function RootStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#6200ee' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name={ROUTES.MAIN_TABS}
                component={MainTabs}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name={ROUTES.DETAIL}
                component={DetailScreen}
                options={({ navigation }) => ({
                    title: ' Détails',
                    headerLeft: () => <DrawerButton navigation={navigation} />,
                    headerRight: () => <HeaderLinks navigation={navigation} />,
                })}
            />

            <Stack.Screen
                name={ROUTES.ABOUT}
                component={AboutUsScreen}
                options={({ navigation }) => ({
                    title: ' À propos de nous',
                    headerLeft: () => <DrawerButton navigation={navigation} />,
                    headerRight: () => <HeaderLinks navigation={navigation} hideAbout />,
                })}
            />
        </Stack.Navigator>
    );
}

function DrawerJump({ targetScreen }) {
    return ({ navigation }) => ({
        drawerItemPress: (e) => {
            e.preventDefault();
            navigation.closeDrawer();

            navigation.navigate(ROUTES.ACCUEIL, {
                screen: ROUTES.MAIN_TABS,
                params: { screen: targetScreen },
            });
        },
    });
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
                <Drawer.Screen name={ROUTES.ACCUEIL} component={RootStack} />

                <Drawer.Screen
                    name="À propos"
                    component={RootStack}
                    listeners={({ navigation }) => ({
                        drawerItemPress: (e) => {
                            e.preventDefault();
                            navigation.closeDrawer();
                            navigation.navigate(ROUTES.ACCUEIL, { screen: ROUTES.ABOUT });
                        },
                    })}
                />

                <Drawer.Screen
                    name="Règles"
                    component={RootStack}
                    listeners={DrawerJump({ targetScreen: ROUTES.RULES })}
                />

                <Drawer.Screen
                    name="Liens utiles"
                    component={RootStack}
                    listeners={DrawerJump({ targetScreen: ROUTES.USEFUL })}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    drawerButton: {
        marginLeft: 15,
    },
    drawerIcon: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    menuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
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