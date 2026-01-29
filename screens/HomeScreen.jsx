import React, { useState } from "react";
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";

import { BANNERS } from "../data/mock_data";
import { MOCK_MOVIES } from "../data/mock_data";

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { title: "Featured Movies", data: MOCK_MOVIES.slice(0, 3) },
    { title: "Currently in Theaters", data: MOCK_MOVIES.slice(1) },
  ];

  const renderBannerSlider = () => (
    <View style={styles.bannerContainer}>
      <FlatList
        data={BANNERS}
        horizontal
        // pagingEnabled={true} -> Bỏ dòng này
        snapToInterval={width * 0.85 + 20} // Chiều rộng ảnh + khoảng cách margin
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10 }} // Padding cho toàn bộ danh sách
        renderItem={({ item }) => (
          <View style={styles.bannerWrapper}>
            <Image
              source={{ uri: item.image }}
              style={styles.bannerImage}
            />
          </View>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        // Thêm Banner vào đầu danh sách chính 
        ListHeaderComponent={renderBannerSlider}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              data={item.data}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("MovieInfo", { movie: item })}>
                  <MovieCard movie={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(movie) => movie._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 16 }}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8"
  },
  bannerContainer: {
    marginVertical: 15, // Khoảng cách trên và dưới của toàn bộ khu vực banner
  },
  bannerWrapper: {
    width: width * 0.85,
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },

  bannerImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 15,
    resizeMode: "contain", // Giữ nguyên độ phân giải, hiển thị toàn bộ nội dung ảnh
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 16
  },
});

export default HomeScreen;