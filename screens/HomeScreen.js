import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { IoTrashBinOutline } from 'react-icons/io';

const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('trips');
      if (value !== null) {
        setTrips(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const deleteTrip = async (index) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedTrips = trips.filter((_, i) => i !== index);
            setTrips(updatedTrips);
            await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const clearAllTrips = async () => {
    setTrips([]);
    await AsyncStorage.removeItem('trips');
  };

  const onRefresh = () => {
    setRefreshing(true);
    retrieveData();
    setRefreshing(false);
  };

  const navigateToViewTrip = (trip) => {
    navigation.navigate('ViewTrip', { trip });
  };

  const renderTripItem = ({ item, index }) => (
    <TouchableOpacity style={styles.tripItem} onPress={() => navigateToViewTrip(item)}>
      <Text style={styles.tripOwner}>{item.owner}'s Trip</Text>
      <TouchableOpacity style={styles.deleteTrip} onPress={() => deleteTrip(index)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No trips available. Logs are empty.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {trips.length > 0 ? (
        <FlatList
          data={trips}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTripItem}
          style={styles.tripList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        renderEmptyList()
      )}
      <View style={styles.buttonsContainer}>
        <LinearGradient colors={['#00a8ff', '#007bff']} style={styles.addTripButton}>
          <TouchableOpacity onPress={() => navigation.navigate('AddTrip')}>
            <Text style={styles.buttonText}>Add Trip</Text>
          </TouchableOpacity>
        </LinearGradient>
        {trips.length > 100 && <Button title="Clear All Trips" onPress={clearAllTrips} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tripList: {
    marginTop: 10,
  },
  deleteTrip: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  deleteText: {
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  tripOwner: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  addTripButton: {
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
