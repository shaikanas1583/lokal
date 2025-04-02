import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/ui/IconSymbol';

const JobCard = ({ job }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    checkIfBookmarked();
  }, []);

  const checkIfBookmarked = async () => {
    const storedJobs = await AsyncStorage.getItem('bookmarkedJobs');
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      setIsBookmarked(jobs.some((j) => j.id === job.id));
    }
  };

  const toggleBookmark = async () => {
    const storedJobs = await AsyncStorage.getItem('bookmarkedJobs');
    let jobs = storedJobs ? JSON.parse(storedJobs) : [];

    if (isBookmarked) {
      jobs = jobs.filter((j) => j.id !== job.id);
    } else {
      jobs.push(job);
    }

    await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(jobs));
    setIsBookmarked(!isBookmarked);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>

        {/* Test: Using emoji first, then replace with IconSymbol */}
        
      </View>

      <Text>📍 Location: {job.primary_details.Place}</Text>
      <Text>💰 Salary: {job.primary_details.Salary}</Text>
      <Text>🕒 Job Type: {job.primary_details.Job_Type}</Text>
      <Text>🔰 Experience: {job.primary_details.Experience}</Text>
      <Text>🎓 Qualification: {job.primary_details.Qualification}</Text>
      <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
          <Text style={{ fontSize: 24 }}>{isBookmarked ? <IconSymbol size={28} name="bookmark.fill" color="black" /> : <IconSymbol size={28} name="bookmark.fill" color="#d3d3d3" />}</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  bookmarkButton: {
    padding: 2,
    alignSelf:'flex-end',    
  },
});

export default JobCard;
