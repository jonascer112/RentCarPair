import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Alert, Image } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { db } from './firebaseConfig';

const ChiefScreen = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      // Reference to the "photos" collection in the database
      const dataRef = ref(db, 'photos');

      // Fetch data from the database
      const snapshot = await get(dataRef);

      // Extract the data from the snapshot
      if (snapshot.exists()) {
        const fetchedData = snapshot.val();

        // Convert the object to an array of items
        const dataArray = Object.keys(fetchedData).map(key => ({ id: key, ...fetchedData[key] }));

        setData(dataArray);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      // Set refreshing to false when data fetching is complete
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  const handleRefresh = () => {
    // Set refreshing to true and fetch data again
    setRefreshing(true);
    fetchData();
  };

  const handleCancelRental = async (id) => {
    try {
      // Reference to the "photos" collection in the database
      const dataRef = ref(db, 'photos', id);
  
      // Remove the rental with the specified ID from the database
      await remove(dataRef);
  
      // Fetch data again after removal
      fetchData();
  
      console.log('Rental canceled and removed from database.');
    } catch (error) {
      console.error('Error canceling rental:', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.dataItem}>
      {/* Display individual data items */}
      <Image source={{ uri: item.photoUrl }} style={styles.photo} />
      <Button
        title="Cancel Rental"
        onPress={() => {
          Alert.alert(
            'Cancel Rental',
            'Are you sure you want to cancel this rental?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Confirm', onPress: () => handleCancelRental(item.id) },
            ],
            { cancelable: false }
          );
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rentals List</Text>
        <Button title="Refresh" onPress={handleRefresh} disabled={refreshing} />
      </View>
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <Text style={styles.noDataText}>No rentals available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dataItem: {
    marginBottom: 16,
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  carModel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default ChiefScreen;
