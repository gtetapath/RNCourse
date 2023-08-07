import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTripScreen = ({ route, navigation }) => {
  const [owner, setOwner] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [people, setPeople] = useState('');
  const [time, setTime] = useState('');
  const [index, setIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params && route.params.trip) {
      const { trip, index } = route.params;
      setOwner(trip.owner);
      setPickup(trip.pickup);
      setDestination(trip.destination);
      setPeople(trip.people);
      setTime(trip.time);
      setIndex(index);
    }
  }, [route.params]);

  const saveTrip = async () => {
    setIsLoading(true);

    const newTrip = { owner, pickup, destination, people, time };
    let updatedTrips = [];

    if (index !== null) {
      // Edit existing trip
      updatedTrips = [...(await AsyncStorage.getItem('trips'))];
      updatedTrips[index] = newTrip;
    } else {
      // Add new trip
      const existingTrips = await AsyncStorage.getItem('trips');
      updatedTrips = existingTrips ? [...JSON.parse(existingTrips), newTrip] : [newTrip];
    }

    await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
    setIsLoading(false);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Trip Owner:</Text>
      <TextInput style={styles.input} value={owner} onChangeText={setOwner} />

      <Text style={styles.label}>Pickup Position:</Text>
      <TextInput style={styles.input} value={pickup} onChangeText={setPickup} />

      <Text style={styles.label}>Destination:</Text>
      <TextInput style={styles.input} value={destination} onChangeText={setDestination} />

      <Text style={styles.label}>Number of People:</Text>
      <TextInput style={styles.input} value={people} onChangeText={setPeople} keyboardType="numeric" />

      <Text style={styles.label}>Pickup Time:</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} />


      {isLoading ? (
        <ActivityIndicator size="small" color="#007bff" style={styles.loadingIndicator} />
      ) : (
        <Button title="Save" onPress={saveTrip} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default AddTripScreen;
