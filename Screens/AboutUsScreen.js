import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, StatusBar,} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function AboutUsScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleContact = () => {
        Linking.openURL('mailto:support@parkmtl.app?subject=Question%20ParkMTL');
    };

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>À Propos</Text>
                <Text style={styles.headerSubtitle}>
                    En savoir plus sur l’application SoSParking
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.appBanner}>
                    <Text style={styles.appName}>SoSParking</Text>
                    <Text style={styles.appVersion}>Version 1.0.0</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Notre Mission</Text>
                    <Text style={styles.cardText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In suscipit erat ligula, a malesuada dolor malesuada gravida. Ut sed lobortis sem, sed tincidunt quam. Nam varius nisl eu leo pellentesque pharetra.
                        {"\n\n"}
                        Sed vehicula quam nec convallis porta. Donec finibus sed augue at viverra. Duis fermentum sit amet nibh posuere condimentum. Vivamus at efficitur felis, vel accumsan libero. Fusce malesuada a est id vehicula. Etiam gravida pharetra sapien, non suscipit est ullamcorper nec. Sed ut pulvinar sapien, a lobortis est.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Données Ouvertes</Text>
                    <Text style={styles.cardText}>
                        Mauris facilisis eros sed rutrum volutpat. Nulla blandit elementum imperdiet. Suspendisse potenti. Maecenas quis mauris lacinia, sodales ante id, efficitur ipsum. Integer condimentum porttitor nibh et dictum. Morbi non vehicula est. Morbi a justo ac turpis mattis blandit. Fusce efficitur sem vitae dolor condimentum, eu iaculis orci tempus.                    </Text>
                </View>


                <View style={styles.card}>
                    <Text style={styles.sectionTitle}> Fonctionnalités</Text>

                    <View style={styles.featureRow}>
                        <Text style={styles.featureText}>Géolocalisation en temps réel et calcul de distance.</Text>
                    </View>

                    <View style={styles.featureRow}>
                        <Text style={styles.featureText}>Indicateurs visuels dynamiques pour repérer les parkings proches.</Text>
                    </View>

                    <View style={styles.featureRow}>
                        <Text style={styles.featureText}>Guides, règles et liens utiles pour éviter les contraventions.</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Une question ou idée ?</Text>
                    <Text style={styles.cardText}>
                        Vous avez repéré un bogue ou souhaitez suggérer une amélioration ? N'hésitez pas à nous écrire !
                    </Text>

                    <TouchableOpacity
                        style={styles.contactButton}
                        activeOpacity={0.8}
                        onPress={handleContact}
                    >
                        <Text style={styles.contactButtonText}>Nous contacter</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.copyrightText}>
                    Fait avec ❤️ pour les automobilistes de Montréal.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    backButton: {
        marginBottom: 8,
    },
    backText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1C1C1E',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 2,
    },
    scrollContent: {
        padding: 16,
    },
    appBanner: {
        alignItems: 'center',
        marginVertical: 16,
    },
    logoBadge: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 36,
    },
    appName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1C1C1E',
    },
    appVersion: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 2,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: '#48484A',
        lineHeight: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    featureText: {
        fontSize: 14,
        color: '#48484A',
        flex: 1,
        lineHeight: 18,
    },
    contactButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 14,
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    copyrightText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 12,
    },
});