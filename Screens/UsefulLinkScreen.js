import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, StatusBar, Alert,} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const USEFUL_LINKS = [
    {
        id: '1',
        title: 'Info-Neige Montréal',
        category: 'Stationnement & Déneigement',
        description:
            'Consultez l’état des opérations de déneigement et évitez les remorquages en temps réel.',
        url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
        icon: '❄️',
        tag: 'Officiel',
    },
    {
        id: '2',
        title: 'PayByPhone (AGP)',
        category: 'Paiement',
        description:
            'Payez votre place de stationnement sur rue ou dans les parcomètres de la ville de Montréal.',
        url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
        icon: '🅿️',
        tag: 'App',
    },
    {
        id: '3',
        title: 'Où est mon véhicule ?',
        category: 'Remorquage',
        description:
            'Retrouvez votre voiture si elle a été remorquée lors de travaux ou d’opérations de déneigement.',
        url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
        icon: '🚗',
        tag: 'Urgence',
    },
    {
        id: '4',
        title: 'Info-Travaux & Entraves',
        category: 'Circulation',
        description:
            'Consultez la carte des entraves routières, cônes oranges et fermetures de rues à Montréal.',
        url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
        icon: '🚧',
        tag: 'Info',
    },
    {
        id: '5',
        title: 'Données Ouvertes Montréal',
        category: 'Ressources',
        description:
            'Accédez aux ensembles de données publiques sur les stationnements et la mobilité.',
        url: 'https://donnees.montreal.ca/',
        icon: '📊',
        tag: 'Data',
    },
];

export default function UsefulLinkScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleOpenLink = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Erreur", "Impossible d'ouvrir ce lien : " + url);
            }
        } catch (error) {
            Alert.alert("Erreur", "Une erreur est survenue lors de l'ouverture du lien.");
        }
    };

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Liens Utiles</Text>
                <Text style={styles.headerSubtitle}>
                    Applications et services officiels de la Ville de Montréal
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {USEFUL_LINKS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => handleOpenLink(item.url)}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.iconTitleRow}>
                                <Text style={styles.cardIcon}>{item.icon}</Text>
                                <View>
                                    <Text style={styles.categoryText}>{item.category}</Text>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                </View>
                            </View>
                            <View style={styles.tagBadge}>
                                <Text style={styles.tagText}>{item.tag}</Text>
                            </View>
                        </View>

                        <Text style={styles.cardDescription}>{item.description}</Text>

                        <View style={styles.actionRow}>
                            <Text style={styles.actionText}>Ouvrir le service</Text>
                            <Text style={styles.actionArrow}>→</Text>
                        </View>
                    </TouchableOpacity>
                ))}
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
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    iconTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#007AFF',
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    tagBadge: {
        backgroundColor: '#E5E5EA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 8,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#48484A',
    },
    cardDescription: {
        fontSize: 14,
        color: '#636366',
        lineHeight: 20,
        marginBottom: 12,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
        paddingTop: 10,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
        marginRight: 4,
    },
    actionArrow: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
});