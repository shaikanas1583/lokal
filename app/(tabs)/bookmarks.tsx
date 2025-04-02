import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobCard from '@/components/JobCards';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const BookmarksScreen: React.FC = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load bookmarks when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  // Function to load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem('bookmarkedJobs');
      setBookmarkedJobs(storedJobs ? JSON.parse(storedJobs) : []);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📌 Bookmarked Jobs</Text>

      {bookmarkedJobs.length > 0 ? (
        <FlatList
          data={bookmarkedJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <JobCard job={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noJobsText}>No bookmarks yet! ⭐</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noJobsText: { fontSize: 16, color: 'gray', textAlign: 'center' },
});

export default BookmarksScreen;
