import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JobDetailsScreen: React.FC = () => {
  const { job } = useLocalSearchParams();
  const jobDetails = job ? JSON.parse(job) : null;
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    checkIfBookmarked();
  }, []);

  // Check if job is already bookmarked
  const checkIfBookmarked = async () => {
    const storedJobs = await AsyncStorage.getItem("bookmarkedJobs");
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs);
      const found = parsedJobs.some((j: any) => j.id === jobDetails?.id);
      setIsBookmarked(found);
    }
  };

  // Handle bookmark toggling
  const toggleBookmark = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem("bookmarkedJobs");
      let bookmarks = storedJobs ? JSON.parse(storedJobs) : [];

      if (isBookmarked) {
        // Remove from bookmarks
        bookmarks = bookmarks.filter((j: any) => j.id !== jobDetails?.id);
        setIsBookmarked(false);
        Alert.alert("Removed", "Job removed from bookmarks");
      } else {
        // Add to bookmarks
        bookmarks.push(jobDetails);
        setIsBookmarked(true);
        Alert.alert("Saved", "Job added to bookmarks");
      }

      await AsyncStorage.setItem("bookmarkedJobs", JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Bookmark error:", error);
    }
  };

  if (!jobDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Job details not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{jobDetails.title}</Text>

      <Text style={styles.detailText}>
        📍 Location:{" "}
        <Text style={styles.value}>{jobDetails.primary_details.Place}</Text>
      </Text>
      <Text style={styles.detailText}>
        💰 Salary:{" "}
        <Text style={styles.value}>{jobDetails.primary_details.Salary}</Text>
      </Text>
      <Text style={styles.detailText}>
        🕒 Job Type:{" "}
        <Text style={styles.value}>{jobDetails.primary_details.Job_Type}</Text>
      </Text>
      <Text style={styles.detailText}>
        🔰 Experience:{" "}
        <Text style={styles.value}>
          {jobDetails.primary_details.Experience}
        </Text>
      </Text>
      <Text style={styles.detailText}>
        🎓 Qualification:{" "}
        <Text style={styles.value}>
          {jobDetails.primary_details.Qualification}
        </Text>
      </Text>
      <Text style={styles.detailText}>
        🛠 Job Role ID:{" "}
        <Text style={styles.value}>{jobDetails.job_role_id}</Text>
      </Text>
      <Text style={styles.detailText}>
        🏢 Job Category ID:{" "}
        <Text style={styles.value}>{jobDetails.job_category_id}</Text>
      </Text>
      <Text style={styles.detailText}>
        📅 Premium Until:{" "}
        <Text style={styles.value}>{jobDetails.premium_till}</Text>
      </Text>

      {/* Fees & Vacancies */}
      <Text style={styles.detailText}>
        💵 Fees Charged:{" "}
        <Text style={styles.value}>
          {jobDetails.primary_details.Fees_Charged === "-1"
            ? "Not Specified"
            : jobDetails.primary_details.Fees_Charged}
        </Text>
      </Text>

      <Text style={styles.detailText}>
        📌 Vacancies:{" "}
        <Text style={styles.value}>
          {jobDetails.job_tags.find((tag) => tag.value.includes("Vacancies"))
            ?.value || "N/A"}
        </Text>
      </Text>

      {/* Job Tags */}
      <View style={styles.tagContainer}>
        {jobDetails.job_tags.map((tag: any, index: number) => (
          <View
            key={index}
            style={[styles.tag, { backgroundColor: tag.bg_color }]}
          >
            <Text style={[styles.tagText, { color: tag.text_color }]}>
              {tag.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Bookmark Button */}
      <TouchableOpacity style={styles.bookmarkButton} onPress={toggleBookmark}>
        <Text style={styles.bookmarkText}>
          {isBookmarked ? "⭐ Bookmarked" : "☆ Bookmark"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  detailText: { fontSize: 16, marginBottom: 5, fontWeight: "500" },
  value: { fontWeight: "bold", color: "#007AFF" },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  tag: { padding: 5, borderRadius: 5, marginRight: 5, marginBottom: 5 },
  tagText: { fontSize: 12, fontWeight: "bold" },
  bookmarkButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
  },
  bookmarkText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});

export default JobDetailsScreen;
