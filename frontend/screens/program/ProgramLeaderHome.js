import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const menuItems = [
  { title: 'Student Classes', screen: 'PLClassesScreen', emoji: '🏫' },
  { title: 'Courses', screen: 'PLCoursesScreen', emoji: '📚' },
  { title: 'Lectures', screen: 'PLLecturesScreen', emoji: '🎤' },
  { title: 'Monitoring', screen: 'PLMonitoringScreen', emoji: '📊' },
  { title: 'Lecture Reports', screen: 'PLReportsScreen', emoji: '📋' },
  { title: 'Rate Lecturers', screen: 'PLRatingScreen', emoji: '⭐' },
];

export default function ProgramLeaderHome({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.userName}>Program Leader</Text>
      </View>
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.7}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { padding: 24, backgroundColor: '#4F46E5', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  greeting: { fontSize: 16, color: '#C7D2FE' },
  userName: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 16, justifyContent: 'space-between' },
  card: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  emoji: { fontSize: 32, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', textAlign: 'center' }
});