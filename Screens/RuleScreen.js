import React from 'react';
import {StyleSheet, Text, View, ScrollView, StatusBar,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RULES_DATA = [
    {
        id: '1',
        code: 'RÈGLE 101-B',
        title: 'Priorité aux déneigeuses',
        description:
            'Si vous entendez la sirène de déneigement, vous avez exactement 4 minutes et 12 secondes pour déplacer votre véhicule, peu importe s’il est 3h du matin ou si vous dormez.',
        category: 'Hiver',
        color: '#007AFF',
    },
    {
        id: '2',
        code: 'RÈGLE 404',
        title: 'Décodage de panneau obligatoire',
        description:
            'Si un panneau comporte plus de 3 interdictions combinées (ex: Mardi 8h-9h sauf juillet et jours fériés), vous devez être titulaire d’un baccalauréat en cryptographie pour vous garer.',
        category: 'Signalisation',
        color: '#FF9500',
    },
    {
        id: '3',
        code: 'RÈGLE 88-A',
        title: 'Chat',
        description:
            'J\'aime les chat.',
        category: 'Saison',
        color: '#5856D6',
    },
    {
        id: '4',
        code: 'RÈGLE 12',
        title: 'Courtoisie du balai à neige',
        description:
            'Il est strictement interdit de prêter son balai à neige à un autre automobiliste sans soupirer théâtralement en mentionnant la rigueur du climat québécois.',
        category: 'Étiquette',
        color: '#34C759',
    },
    {
        id: '5',
        code: 'RÈGLE 3.14',
        title: 'La zone orange',
        description:
            'Tout cône orange trouvé seul sur la chaussée protège magiquement un rayon de 2 mètres autour de lui. Il est interdit d’y toucher sous peine de malédiction routière.',
        category: 'Chantiers',
        color: '#FF3B30',
    },
];

export default function RuleScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Règlements non officiels</Text>
                <Text style={styles.headerSubtitle}>
                    Guide de survie du stationnement à Montréal
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {RULES_DATA.map((rule) => (
                    <View key={rule.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View
                                style={[
                                    styles.categoryBadge,
                                    { backgroundColor: `${rule.color}20` },
                                ]}
                            >
                                <Text style={[styles.categoryText, { color: rule.color }]}>
                                    {rule.category}
                                </Text>
                            </View>
                            <Text style={styles.codeText}>{rule.code}</Text>
                        </View>

                        <Text style={styles.ruleTitle}>{rule.title}</Text>
                        <Text style={styles.ruleDescription}>{rule.description}</Text>
                    </View>
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
        paddingBottom: 32,
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
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    codeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8E8E93',
    },
    ruleTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 6,
    },
    ruleDescription: {
        fontSize: 14,
        color: '#48484A',
        lineHeight: 20,
    },
});