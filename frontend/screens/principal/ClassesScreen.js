import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function PRLClassesScreen() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(data);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        data.filter(
          item =>
            item.className?.toLowerCase().includes(q) ||
            item.courseName?.toLowerCase().includes(q) ||
            item.lecturerName?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, data]);

  const loadClasses = async () => {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => d.data());
      const grouped = {};

      reports.forEach(r => {
        if (!r.className) return;
        if (!grouped[r.className]) {
          grouped[r.className] = {
            className: r.className,
            courseName: r.courseName || 'N/A',
            courseCode: r.courseCode || 'N/A',
            lecturerName: r.lecturerName || 'N/A',
            venue: r.venue || 'N/A',
            totalRegistered: Number(r.totalStudents || 0),
            lectures: 1,
          };
        } else {
          grouped[r.className].lectures++;
          if (Number(r.totalStudents) > grouped[r.className].totalRegistered) {
            grouped[r.className].totalRegistered = Number(r.totalStudents);
          }
        }
      });

      const result = Object.values(grouped);
      setData(result);
      setFiltered(result);
    } catch (e) {
      console.log('PRL Classes error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Classes</Text>
        <Text style={styles.headerSub}>All classes under your stream</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by class, course, or lecturer..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Results count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} class(es)</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {search ? 'No matching classes' : 'No classes found'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Text style={styles.iconEmoji}>📚</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.title}>{item.className}</Text>
                <Text style={styles.subtitle}>
                  {item.courseName} ({item.courseCode})
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Lecturer</Text>
                <Text style={styles.detailValue}>{item.lecturerName}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Venue</Text>
                <Text style={styles.detailValue}>{item.venue}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Registered</Text>
                <Text style={styles.detailValue}>{item.totalRegistered}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Lectures</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.lectures}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  countRow: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  countText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: '40%',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  badge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});