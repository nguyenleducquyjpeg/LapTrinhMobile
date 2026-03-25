import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

const MovieInfoScreen = ({ route, navigation }) => {
  // Nhận dữ liệu phim cơ bản từ trang trước truyền sang
  const { movie } = route.params || {};
  const [selectedMovie, setSelectedMovie] = useState(null);

  const openTrailer = () => {
    if (!selectedMovie?.trailer_id) return;

    const url = `https://www.youtube.com/watch?v=${selectedMovie.trailer_id}`;
    Linking.openURL(url);
  };

  const handleBooking = () => {
    navigation.navigate("ShowTimes", { movie: selectedMovie });
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const doc = await firestore()
          .collection("movies")
          .doc(movie.id)
          .get();
        if (doc.exists) {
          const data = doc.data();
          setSelectedMovie({
            id: doc.id,
            title: data.title,
            image: data.image,
            category: data.category,
            rating: data.rating,
            description: data.description,
            duration: data.duration,
            reviews: data.reviews || [],
            trailer_id: data.trailer_id,
          });
        }
      } catch (error) {
        console.error("Lỗi fetch movie:", error);
      }
    };

    fetchMovie();
  }, [movie]);

  if (!selectedMovie) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // --- FOOTER ĐIỀU HƯỚNG ĐỒNG BỘ ---
  const renderFooterTab = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={22} color="#666" />
        <Text style={styles.tabText}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="ticket-outline" size={22} color="#666" />
        <Text style={styles.tabText}>Voucher</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatAiButton}>
        <View style={styles.chatAiCircle}>
          <Ionicons name="chatbubbles" size={26} color="#fff" />
        </View>
        <Text style={[styles.tabText, { marginTop: 28 }]}>ChatAI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="gift-outline" size={22} color="#666" />
        <Text style={styles.tabText}>Khuyến mãi</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("AccountInfo")}>
        <Ionicons name="person-outline" size={22} color="#666" />
        <Text style={styles.tabText}>Cá nhân</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainWrapper}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER VỚI NÚT BACK */}
        <View style={styles.customHeader}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Chi tiết phim</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* PHẦN THÔNG TIN CHI TIẾT NHƯ HÌNH */}
          <View style={styles.movieHeaderSection}>
            {/* Cột trái: Poster */}
            <View style={styles.posterWrapper}>
              <Image
                style={styles.mainPoster}
                source={{ uri: selectedMovie?.image }}
              />
            </View>

            {/* Cột phải: Thông tin chữ */}
            <View style={styles.mainDetails}>
              <Text style={styles.movieTitleText}>{selectedMovie?.title}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thể loại: </Text>
                <Text style={styles.infoValue}>{selectedMovie?.category || 'N/A'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thời lượng: </Text>
                <Text style={styles.infoValue}>{selectedMovie?.duration || 0} phút</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Khởi chiếu: </Text>
                <Text style={styles.infoValue}>{selectedMovie?.release_date || 'Đang cập nhật'}</Text>
              </View>

              <View style={styles.ratingContainer}>
                <Text style={styles.infoLabel}>Xếp loại </Text>
                <Ionicons name="star" size={18} color="#f1c40f" />
                <Text style={styles.ratingBold}>{selectedMovie?.rating || '0.0'}</Text>
                <Text style={styles.ratingMax}>/10</Text>
              </View>

              {/* NÚT XEM TRAILER MỚI */}
              <TouchableOpacity style={styles.trailerBtn} onPress={openTrailer}>
                <Ionicons name="play-circle" size={20} color="#fff" />
                <Text style={styles.trailerBtnText}>XEM TRAILER</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* NỘI DUNG TÓM TẮT */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Nội dung</Text>
            <Text style={styles.descriptionText}>
              {selectedMovie?.description || "Nội dung đang được cập nhật..."}
            </Text>
          </View>

          {/* PHẦN ĐÁNH GIÁ (REVIEWS) - MỚI THÊM */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Đánh giá từ khán giả</Text>
            {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
              selectedMovie.reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.reviewUser}>{review.user_name}</Text>
                    <View style={styles.starRow}>
                      <Ionicons name="star" size={12} color="#f1c40f" />
                      <Text style={styles.reviewRatingText}>{review.rating}/5</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewText}>Chưa có đánh giá nào.</Text>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.writeReviewBtn}
          onPress={() => navigation.navigate("WriteReview", { movie: selectedMovie })}
        >
          <Ionicons name="chatbox" size={18} color="#fff" />
          <Text style={styles.writeReviewBtnText}>VIẾT ĐÁNH GIÁ</Text>
        </TouchableOpacity>

        {/* NÚT ĐẶT VÉ NỔI */}
        <TouchableOpacity style={styles.floatBookingBtn} onPress={handleBooking}>
          <Text style={styles.bookingBtnText}>ĐẶT VÉ NGAY</Text>
        </TouchableOpacity>

      </SafeAreaView>
      {renderFooterTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: "#fff" },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 160 },

  // Header
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: { fontSize: 17, fontWeight: "bold", color: "#000", flex: 1, textAlign: 'center' },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center",
  },

  // Movie Info
  movieHeaderSection: {
    flexDirection: 'row', // Chia thành 2 cột ngang
    padding: 16,
    backgroundColor: '#fff',
  },
  posterWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  mainPoster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  mainDetails: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  movieTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingBold: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ratingMax: {
    fontSize: 12,
    color: '#888',
  },

  // Nút Trailer
  trailerBtn: {
    flexDirection: 'row',
    backgroundColor: '#b71c1c', // Màu đen để nổi bật trên nền trắng
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  trailerBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  // Sections
  sectionContainer: { paddingHorizontal: 16, marginTop: 25 },
  sectionHeader: { fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 12 },
  descriptionText: { fontSize: 14, color: "#444", lineHeight: 22, textAlign: 'justify' },

  // Review Styles
  reviewItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewUser: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  starRow: { flexDirection: 'row', alignItems: 'center' },
  reviewRatingText: { fontSize: 12, marginLeft: 3, color: '#666' },
  reviewComment: { color: '#555', marginVertical: 6, fontSize: 13, lineHeight: 18 },
  reviewDate: { color: '#999', fontSize: 11, textAlign: 'right' },
  noReviewText: { color: '#999', fontStyle: 'italic' },

  // Booking Button
  floatBookingBtn: {
    position: 'absolute', bottom: 100, left: 20, right: 20,
    backgroundColor: "#b71c1c", height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', elevation: 8,
  },
  bookingBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

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
    position: 'absolute', top: -30,
  },
  writeReviewBtn: {
    position: 'absolute',
    bottom: 160,
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderColor: '#b71c1c',
    borderWidth: 1,
    marginBottom: 5,
  },
  writeReviewBtnText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold"
  },
});

export default MovieInfoScreen;