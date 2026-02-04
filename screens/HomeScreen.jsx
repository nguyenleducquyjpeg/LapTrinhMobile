import React, { useState } from "react";
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";
import Ionicons from "react-native-vector-icons/Ionicons";

import { BANNERS, MOCK_MOVIES, CATEGORIES, PROMOTIONS, EGIFTS, VIDEOS } from "../data/mock_data";

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Thêm các section mới vào mảng sections
  const sections = [
    { type: 'MOVIE', title: "Phim nổi bật", data: MOCK_MOVIES.slice(0, 3) },
    { type: 'MOVIE', title: "Phim đang chiếu", data: MOCK_MOVIES.slice(1) },
    { type: 'OTHER', title: "Tin nóng", data: PROMOTIONS },
    { type: 'OTHER', title: "eGift", data: EGIFTS },
    { type: 'OTHER', title: "Videos", data: VIDEOS },
  ];

  // Hàm render chung cho các mục không phải phim (Ưu đãi, eGift, Video)
  const renderOtherItem = (item) => (
    <View style={styles.otherItemWrapper}>
      <Image source={{ uri: item.image }} style={styles.otherImage} />
      <Text style={styles.otherItemTitle} numberOfLines={2}>{item.title}</Text>
    </View>
  );

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

  const renderCategoryGrid = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.sectionTitle}>Thể loại</Text>
      <View style={styles.gridWrapper}>
        {CATEGORIES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.categoryItem}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={24} color="#e71a0f" />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={
          <View>
            {renderBannerSlider()}
            {renderCategoryGrid()}
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>TẤT CẢ</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={item.data}
              renderItem={({ item: subItem }) => {
                if (item.type === 'MOVIE') {
                  return (
                    <TouchableOpacity onPress={() => navigation.navigate("MovieInfo", { movie: subItem })}>
                      <MovieCard movie={subItem} />
                    </TouchableOpacity>
                  );
                } else {
                  return renderOtherItem(subItem);
                }
              }}
              keyExtractor={(subItem) => subItem.id || subItem._id}
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
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  bannerContainer: { marginVertical: 15 },
  bannerWrapper: {
    width: width * 0.85,
    marginHorizontal: 10,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  bannerImage: { width: "100%", aspectRatio: 16 / 9, borderRadius: 15, resizeMode: "contain" },

  // Styles Category Grid
  categoryContainer: { marginBottom: 10 },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  categoryItem: {
    width: (width - 20) / 4, // Chia 4 cột đều nhau
    alignItems: 'center',
    marginBottom: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  seeAllText: {
    color: '#b80000',
    fontSize: 12,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  otherItemWrapper: {
    width: width * 0.42,
    marginRight: 12,
  },
  otherImage: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  otherItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  categoryName: { fontSize: 12, color: '#333', marginTop: 5, textAlign: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10, marginLeft: 16 },
});

export default HomeScreen;