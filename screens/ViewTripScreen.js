// src/screens/ViewTripScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewTripScreen = ({ route }) => {
  const { trip } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Trip Owner:</Text>
      <Text>{trip.owner}</Text>
      <Text style={styles.label}>Pickup Position:</Text>
      <Text>{trip.pickup}</Text>
      <Text style={styles.label}>Destination:</Text>
      <Text>{trip.destination}</Text>
      <Text style={styles.label}>Number of People:</Text>
      <Text>{trip.people}</Text>
      <Text style={styles.label}>Pickup Time:</Text>
      <Text>{trip.time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ViewTripScreen;
