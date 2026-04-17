import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const menuItems = [
  { title: 'My Attendance', screen: 'AttendanceScreen', emoji: '📊' },
  { title: 'Rate Lecturer', screen: 'RatingScreen', emoji: '⭐' },
];

export default function StudentHome({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.userName}>Student</Text>
        <Text style={styles.subHeader}>Track your progress and provide feedback.</Text>
      </View>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { padding: 24, backgroundColor: '#2563EB', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  greeting: { fontSize: 16, color: '#BFDBFE' },
  userName: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  subHeader: { fontSize: 14, color: '#93C5FD', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 16, justifyContent: 'space-between', marginTop: 20 },
  card: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 30, flexDirection: 'row', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  emoji: { fontSize: 32, marginRight: 20 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' }
});