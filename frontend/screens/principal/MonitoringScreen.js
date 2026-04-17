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

export default function PRLMonitoringScreen() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    load();
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

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => d.data());
      const grouped = {};

      reports.forEach(r => {
        const key = r.className;
        if (!key) return;

        if (!grouped[key]) {
          grouped[key] = {
            className: key,
            courseName: r.courseName || 'N/A',
            lecturerName: r.lecturerName || 'N/A',
            lectures: 1,
            totalPresent: Number(r.studentsPresent || 0),
            totalRegistered: Number(r.totalStudents || 0),
            latestTopic: r.topic || 'N/A',
            latestDate: r.date || 'N/A',
            hasFeedback: r.recommendations?.trim()?.length > 0,
            feedbackCount: r.recommendations?.trim()?.length > 0 ? 1 : 0,
          };
        } else {
          grouped[key].lectures++;
          grouped[key].totalPresent += Number(r.studentsPresent || 0);
          if (Number(r.totalStudents) > grouped[key].totalRegistered) {
            grouped[key].totalRegistered = Number(r.totalStudents);
          }
          if (r.topic) grouped[key].latestTopic = r.topic;
          if (r.date) grouped[key].latestDate = r.date;
          if (r.recommendations?.trim()?.length > 0) {
            grouped[key].feedbackCount++;
            grouped[key].hasFeedback = true;
          }
        }
      });

      const result = Object.values(grouped).map(item => {
        const expected = item.totalRegistered * item.lectures;
        const pct = expected > 0 ? ((item.totalPresent / expected) * 100).toFixed(1) : '0.0';
        return { ...item, percent: parseFloat(pct) };
      });

      setData(result);
      setFiltered(result);
    } catch (e) {
      console.log('PRL Monitoring error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (percent) => {
    if (percent >= 75) return '#16A34A';
    if (percent >= 50) return '#F59E0B';
    return '#EF4444';
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
      {/* Summary */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{data.length}</Text>
          <Text style={styles.summaryLabel}>Classes</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {data.reduce((a, b) => a + b.lectures, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Lectures</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {data.filter(d => d.percent >= 75).length}
          </Text>
          <Text style={styles.summaryLabel}>On Track</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {data.filter(d => d.percent < 50).length}
          </Text>
          <Text style={styles.summaryLabel}>At Risk</Text>
        </View>
      </View>

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

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {search ? 'No matching results' : 'No monitoring data'}
          </Text>
        }
        renderItem={({ item }) => {
          const color = getColor(item.percent);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconEmoji}>📊</Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.title}>{item.className}</Text>
                  <Text style={styles.subtitle}>
                    {item.courseName} · {item.lecturerName}
                  </Text>
                </View>
                <View style={[styles.percentBadge, { backgroundColor: color + '15' }]}>
                  <Text style={[styles.percentText, { color }]}>{item.percent}%</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.lectures}</Text>
                  <Text style={styles.statLabel}>Lectures</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.totalPresent}</Text>
                  <Text style={styles.statLabel}>Present</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.totalRegistered}</Text>
                  <Text style={styles.statLabel}>Registered</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.feedbackCount}</Text>
                  <Text style={styles.statLabel}>w/ Feedback</Text>
                </View>
              </View>

              <View style={styles.topicRow}>
                <Text style={styles.topicLabel}>Latest:</Text>
                <Text style={styles.topicValue} numberOfLines={1}>
                  {item.latestTopic}
                </Text>
                <Text style={styles.topicDate}>{item.latestDate}</Text>
              </View>
            </View>
          );
        }}
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
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    margin: 16,
    marginBottom: 0,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#A7F3D0',
    marginTop: 2,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  list: {
    padding: 16,
    paddingTop: 8,
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
    backgroundColor: '#ECFDF5',
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
  percentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#F1F5F9',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  topicLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginRight: 6,
  },
  topicValue: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
  },
  topicDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 8,
  },
});