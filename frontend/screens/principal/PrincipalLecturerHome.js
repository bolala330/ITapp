import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const MODULES = [
  { key: 'PRLCoursesScreen', label: 'Courses', desc: 'View courses & lectures under your stream', icon: '📖', color: '#2563EB' },
  { key: 'PRLReportsScreen', label: 'Reports', desc: 'View reports & add feedback', icon: '📝', color: '#7C3AED' },
  { key: 'PRLMonitoringScreen', label: 'Monitoring', desc: 'Track class attendance & progress', icon: '📊', color: '#059669' },
  { key: 'PRLRatingScreen', label: 'Ratings', desc: 'Lecturer performance ratings', icon: '⭐', color: '#D97706' },
  { key: 'PRLClassesScreen', label: 'Classes', desc: 'All assigned classes overview', icon: '📚', color: '#DC2626' },
];

export default function PrincipalLecturerHome({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerEmoji}>🎓</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Principal Lecturer</Text>
          <Text style={styles.headerSub}>Faculty of ICT · LUCT</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Dashboard</Text>
          <Text style={styles.summarySub}>
            Manage your stream — courses, reports, monitoring, ratings & classes
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillText}>5 Modules</Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillText}>Real-time Data</Text>
            </View>
          </View>
        </View>

        {/* Module Cards */}
        {MODULES.map(mod => (
          <TouchableOpacity
            key={mod.key}
            style={styles.card}
            onPress={() => navigation.navigate(mod.key)}
            activeOpacity={0.85}
          >
            <View style={[styles.cardIcon, { backgroundColor: mod.color + '12' }]}>
              <Text style={styles.cardEmoji}>{mod.icon}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>{mod.label}</Text>
              <Text style={styles.cardDesc}>{mod.desc}</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerEmoji: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summarySub: {
    fontSize: 13,
    color: '#BFDBFE',
    marginTop: 6,
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  summaryPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  summaryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  cardArrow: {
    fontSize: 24,
    color: '#CBD5E1',
    fontWeight: '300',
  },
});