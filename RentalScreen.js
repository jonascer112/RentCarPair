import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Alert } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { db } from './firebaseConfig';

const ChiefScreen = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      // Reference to the "rentalsData" collection in the database
      const dataRef = ref(db, 'rentalsData');

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

  const handleApproveRental = async (id) => {
    try {
      // Reference to the "rentalsData" collection in the database
      const dataRef = ref(db, 'rentalsData', id);
  
      // Remove the rental with the specified ID from the database
      await remove(dataRef);
  
      // Fetch data again after removal
      fetchData();
  
      console.log('Rental approved and removed from database.');
    } catch (error) {
      console.error('Error approving rental:', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.dataItem}>
      {/* Display individual data items */}
      <Text>Car Model: {item.carModel}</Text>
      <Text>Number of Seats: {item.numberOfSeats}</Text>
      <Text>Rental Price: {item.rentalPrice}</Text>
      <Button
        title="Approve Rental"
        onPress={() => {
          Alert.alert(
            'Approve Rental',
            'Are you sure you want to approve this rental?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Approve', onPress: () => handleApproveRental(item.id) },
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
        <Text style={styles.title}>Retrieve Data from Database</Text>
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
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
  },
  dataItem: {
    marginBottom: 16,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
});

export default ChiefScreen;
