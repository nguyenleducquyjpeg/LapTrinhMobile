import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, FlatList, View, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';

import { BANNERS, MOCK_MOVIES, CATEGORIES, PROMOTIONS, EGIFTS, VIDEOS } from "../data/mock_data";

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [movies, setMovies] = useState([]);

  const filteredMovies = selectedCategory
    ? movies.filter(movie =>
      movie.category.toLowerCase().includes(selectedCategory.toLowerCase())
    )
    : movies;

  // Thêm các section mới vào mảng sections
  const sections = [
    { type: 'MOVIE', title: "Phim nổi bật", data: filteredMovies.slice(0, 3) },
    { type: 'MOVIE', title: "Phim đang chiếu", data: filteredMovies.slice(1) },
    { type: 'OTHER', title: "Tin nóng", data: PROMOTIONS },
    { type: 'OTHER', title: "CGV eGift", data: EGIFTS },
    { type: 'OTHER', title: "Videos", data: VIDEOS },
  ];

  const uploadMoviesToFirestore = async () => {
    try {
      const batch = firestore().batch();
      MOCK_MOVIES.forEach((movie) => {
        // 1. Sử dụng _id từ mock_data làm ID của document
        const docRef = firestore().collection('movies').doc(String(movie._id));
        // 2. Ánh xạ đúng tên thuộc tính từ file mock_data.js
        batch.set(docRef, {
          title: movie.movie_name,
          image: movie.movie_poster,
          category: movie.genre,
          rating: movie.rating,
          description: movie.description || "Mô tả đang cập nhật",
          duration: movie.duration || "120 min",
          reviews: [],
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      Alert.alert("Thành công", "Dữ liệu phim từ mock_data đã lên Firestore!");
    } catch (error) {
      console.error("Lỗi chi tiết:", error);
      Alert.alert("Lỗi", "Kiểm tra lại quyền ghi (Rules) hoặc trạng thái đăng nhập!");
    }
  };

  useEffect(() => {
    //uploadMoviesToFirestore(); // Mở comment dòng này, Save để chạy, sau đó đóng lại ngay!
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("movies")
      .onSnapshot(snapshot => {
        const movieList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            image: data.image,
            category: data.category,
            rating: data.rating,
            description: data.description,
            duration: data.duration,
          };
        });
        console.log("DATA FIRESTORE:", movieList);
        setMovies(movieList);
      });

    return () => unsubscribe();
  }, []);

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
          <TouchableOpacity
            key={item.id}
            style={[
              styles.categoryItem,
              selectedCategory === item.name && { backgroundColor: "#ffe0e0" }
            ]}
            onPress={() => {
              if (item.name === "Tất cả") {
                setSelectedCategory(null);
              } else {
                setSelectedCategory(item.name);
              }
            }}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={24} color="#e71a0f" />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // --- FOOTER NAVIGATION ---
  const renderFooterTab = () => (
    <View style={styles.footerContainer}>
      {/* Trang chủ */}
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home" size={24} color="#b80000" />
        <Text style={[styles.tabText, { color: '#b80000' }]}>Trang chủ</Text>
      </TouchableOpacity>

      {/* Voucher */}
      <TouchableOpacity style={styles.tabItem} onPress={() => console.log("Voucher")}>
        <Ionicons name="ticket-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Voucher</Text>
      </TouchableOpacity>

      {/* ChatAI (Center Button) */}
      <TouchableOpacity
        style={styles.chatAiButton}
        onPress={() => navigation.navigate("ChatAi")}
      >
        <View style={styles.chatAiCircle}>
          <Ionicons name="chatbubbles" size={30} color="#fff" />
        </View>
        <Text style={[styles.tabText, { marginTop: 28 }]}>ChatAI</Text>
      </TouchableOpacity>

      {/* Lịch sử giao dịch */}
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("TransactionHistory")}>
        <Ionicons name="receipt-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Lịch sử</Text>
      </TouchableOpacity>

      {/* Cá nhân */}
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("AccountInfo")}>
        <Ionicons name="person-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Cá nhân</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          ListHeaderComponent={
            <View>
              <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              {renderBannerSlider()}
              {renderCategoryGrid()}
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20 }}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <TouchableOpacity><Text style={styles.seeAllText}>TẤT CẢ</Text></TouchableOpacity>
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
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </SafeAreaView>

      {/* Hiển thị Footer */}
      {renderFooterTab()}
    </View>
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
  categoryContainer: { marginBottom: 10 },
  gridWrapper: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, justifyContent: 'flex-start' },
  categoryItem: { width: (width - 20) / 4, alignItems: 'center', marginBottom: 15 },
  iconCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', elevation: 3,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  categoryName: { fontSize: 12, color: '#333', marginTop: 5, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10, marginLeft: 16 },
  seeAllText: { color: '#b80000', fontSize: 11, fontWeight: 'bold', borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 8, borderRadius: 10 },
  otherItemWrapper: { width: width * 0.42, marginRight: 12 },
  otherImage: { width: '100%', height: 110, borderRadius: 8, backgroundColor: '#ddd' },
  otherItemTitle: { fontSize: 13, fontWeight: 'bold', marginTop: 8, color: '#333' },

  // --- STYLES CHO FOOTER ---
  footerContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 5,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 10, color: '#666', marginTop: 4 },
  chatAiButton: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  chatAiCircle: {
    width: 55, height: 55, borderRadius: 28, backgroundColor: '#b80000',
    justifyContent: 'center', alignItems: 'center', elevation: 5,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
    position: 'absolute', top: -30, // Đẩy nút lên cao
  }
});

export default HomeScreen;