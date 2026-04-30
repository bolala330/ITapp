import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LecturerRatingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lecturer Ratings Screen</Text>
      {/* Add your rating display logic here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LecturerRatingScreen;