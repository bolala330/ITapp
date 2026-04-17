import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function PRLReportsScreen() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(data);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        data.filter(
          item =>
            item.lecturerName?.toLowerCase().includes(q) ||
            item.courseName?.toLowerCase().includes(q) ||
            item.className?.toLowerCase().includes(q) ||
            item.topic?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, data]);

  const loadReports = async () => {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const sorted = reports.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setData(sorted);
      setFiltered(sorted);
    } catch (e) {
      console.log('PRL Reports error:', e);
    } finally {
      setLoading(false);
    }
  };

  const openFeedback = (report) => {
    setSelectedReport(report);
    setFeedbackText(report.prlFeedback || '');
    setModalVisible(true);
  };

  const saveFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Required', 'Please enter feedback before saving.');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'reports', selectedReport.id), {
        prlFeedback: feedbackText.trim(),
        prlFeedbackAt: new Date(),
      });
      Alert.alert('Saved', 'Feedback added successfully ✅');
      setModalVisible(false);

      // Update local state
      setData(prev =>
        prev.map(r =>
          r.id === selectedReport.id
            ? { ...r, prlFeedback: feedbackText.trim() }
            : r
        )
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to save feedback');
      console.log(e);
    } finally {
      setSaving(false);
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <Text style={styles.headerSub}>View lecture reports & add feedback</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by lecturer, course, class, or topic..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} report(s)</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {search ? 'No matching reports' : 'No reports found'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Text style={styles.iconEmoji}>📝</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.title}>{item.courseName}</Text>
                <Text style={styles.subtitle}>
                  {item.courseCode} · {item.className}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Report Details */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Lecturer</Text>
                <Text style={styles.detailValue}>{item.lecturerName}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{item.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Week</Text>
                <Text style={styles.detailValue}>{item.week}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Attendance</Text>
                <Text style={styles.detailValue}>
                  {item.studentsPresent}/{item.totalStudents}
                </Text>
              </View>
            </View>

            {/* Topic */}
            <View style={styles.topicBox}>
              <Text style={styles.topicLabel}>Topic Taught:</Text>
              <Text style={styles.topicText}>{item.topic || 'N/A'}</Text>
            </View>

            {/* Lecturer Recommendations */}
            {item.recommendations ? (
              <View style={styles.recoBox}>
                <Text style={styles.recoLabel}>Lecturer Recommendations:</Text>
                <Text style={styles.recoText}>{item.recommendations}</Text>
              </View>
            ) : null}

            {/* PRL Feedback Status */}
            {item.prlFeedback ? (
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackLabel}>✅ Your Feedback:</Text>
                <Text style={styles.feedbackText}>{item.prlFeedback}</Text>
              </View>
            ) : (
              <View style={styles.noFeedbackBox}>
                <Text style={styles.noFeedbackText}>
                  ⚠️ No feedback added yet
                </Text>
              </View>
            )}

            {/* Add Feedback Button */}
            <TouchableOpacity
              style={styles.feedbackBtn}
              onPress={() => openFeedback(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.feedbackBtnText}>
                {item.prlFeedback ? '✏️ Edit Feedback' : '➕ Add Feedback'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Feedback Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add PRL Feedback</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              For: {selectedReport?.courseName} by {selectedReport?.lecturerName}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter your feedback, observations, or recommendations..."
              placeholderTextColor="#94A3B8"
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, saving && styles.modalSaveDisabled]}
                onPress={saveFeedback}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSaveText}>Save Feedback</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#F5F3FF',
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
  topicBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  topicLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  topicText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  recoBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  recoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  recoText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  feedbackBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 13,
    color: '#14532D',
    lineHeight: 18,
  },
  noFeedbackBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  noFeedbackText: {
    fontSize: 12,
    color: '#991B1B',
    textAlign: 'center',
  },
  feedbackBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  feedbackBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalClose: {
    fontSize: 20,
    color: '#94A3B8',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    minHeight: 140,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  modalSave: {
    flex: 2,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveDisabled: {
    backgroundColor: '#A78BFA',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});