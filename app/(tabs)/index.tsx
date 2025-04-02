import React, { useEffect, useState } from 'react';
import { Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import JobCard from '@/components/JobCards';
import {  useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
interface Job {
  id: number;
  title: string;
  primary_details: {
    Place: string;
    Salary: string;
    Job_Type: string;
    Experience: string;
    Qualification: string;
  };
  job_tags: { value: string; bg_color: string; text_color: string }[];
}

const JobsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const router=useRouter()
  const fetchJobs = async () => {
    try {
      console.log(`Fetching jobs for page ${page}...`);
      const response = await axios.get<{ results?: Job[] }>(
        `https://testapi.getlokalapp.com/common/jobs?page=${page}`
      );

      // console.log('API Response:', response.data);

      if (response.data?.results && Array.isArray(response.data.results)) {
        setJobs((prevJobs) => [...prevJobs, ...response.data.results]);
      } else {
        setError('Invalid API response format.');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item, index) => item?.id?.toString() ?? `job-${index}`}
          renderItem={({ item }) =>
            item?.id ? (
              <TouchableOpacity onPress={() => router.push({ pathname: '/details/JobDetails', params: { job: JSON.stringify(item) } })}>                <JobCard job={item} />
              </TouchableOpacity>
            ) : null
          }
          onEndReached={() => setPage((prevPage) => prevPage + 1)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (loading ? <ActivityIndicator size="large" color="#007AFF" /> : null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  error: { textAlign: 'center', color: 'red', marginTop: 20 },
});

export default JobsScreen;
