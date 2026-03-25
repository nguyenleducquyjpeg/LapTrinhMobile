import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import firestore from '@react-native-firebase/firestore';


const MovieCard = ({ movie }) => {
  // Hàm định dạng số an toàn
  function formatNumber(num) {
    if (!num || isNaN(num)) return "0";
    if (num >= 1000) {
      const suffixes = ['k', 'M', 'B', 'T'];
      const magnitude = Math.floor(Math.log10(num) / 3);
      const formattedNum = (num / Math.pow(1000, magnitude)).toFixed(1);
      return formattedNum + suffixes[magnitude - 1];
    }
    return num.toString();
  }

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: movie.image || 'https://via.placeholder.com/150' }}
        style={styles.poster}
      />

      <View style={styles.infoContainer}>
        <View style={styles.ratingContainer}>
          <Text style={{ fontSize: 14 }}>⭐</Text>
          <Text style={styles.ratingText}>
            {movie.rating || 0}/10
          </Text>

          <Text style={styles.ratingSubText}>
            (0 Ratings)
          </Text>
        </View>

        <Text style={styles.movieTitle} numberOfLines={1}>
          {movie.title || "Chưa có tên"}
        </Text>

        <Text style={styles.genre} numberOfLines={1}>
          {movie.category || "N/A"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 3,
  },
  poster: {
    width: "100%",
    height: 240,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoContainer: {
    alignItems: "center",
    padding: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    gap: 4
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  ratingSubText: {
    fontSize: 10,
    color: "#666",
  },
  movieTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
    textAlign: "center",
  },
  genre: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});

export default MovieCard;