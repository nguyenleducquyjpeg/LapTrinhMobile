// TicketConfirmationScreen.jsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const TicketConfirmationScreen = ({ route, navigation }) => {
  const { movie, theater, screening, selectedSeats, foodItems, finalTotal } = route.params || {};

  // Helper function để format ngày
  const formatScreeningDate = (dateString) => {
    if (!dateString) return "Đang cập nhật";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return "Đang cập nhật";
    }
  };

  // Helper function để format giờ
  const formatScreeningTime = (dateString) => {
    if (!dateString) return "Đang cập nhật";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return "Đang cập nhật";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#e71a0f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>XÁC NHẬN VÉ</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Thông tin phim */}
        <View style={styles.section}>
          <View style={styles.movieInfoRow}>
            {/* Poster phim */}
            <Image
              source={{ uri: movie?.image || movie?.movie_poster }} // Ưu tiên 'image' từ Firestore
              style={styles.confirmationPoster}
              resizeMode="cover"
            />

            {/* Chi tiết văn bản */}
            <View style={styles.movieTextDetails}>
              <Text style={styles.movieName} numberOfLines={2}>
                {movie?.title || movie?.movie_name}
              </Text>
              <Text style={styles.detailText}>{theater?.theater_name}</Text>

              {/* FIX: Hiển thị giờ và ngày đúng */}
              <Text style={styles.detailText}>
                <Ionicons name="time-outline" size={14} color="#666" />
                {" "}
                {formatScreeningTime(screening?.screening_time)}
                {" - "}
                {formatScreeningDate(screening?.screening_time)}
              </Text>

              <Text style={styles.detailText}>
                <Ionicons name="location-outline" size={14} color="#666" /> Suất chiếu: 2D Phụ đề
              </Text>
            </View>
          </View>
        </View>

        {/* Ghế đã chọn */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Ghế đã chọn:</Text>
            <Text style={styles.value}>{selectedSeats?.join(", ")}</Text>
          </View>
        </View>

        {/* Bắp nước đã chọn */}
        {foodItems?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bắp & Nước</Text>
            {foodItems.map((item) => (
              <View key={item.id} style={styles.rowBetween}>
                <Text style={styles.foodName}>{item.quantity}x {item.name}</Text>
                <Text style={styles.foodPrice}>{(item.price * item.quantity).toLocaleString()} đ</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GIẢM GIÁ / ƯU ĐÃI</Text>

          <TouchableOpacity style={styles.promoRow}>
            <View style={styles.promoLeft}>
              <Ionicons name="ticket-outline" size={24} color="#e71a0f" />
              <Text style={styles.promoLabel}>Voucher / eGift</Text>
            </View>
            <View style={styles.promoRight}>
              <Text style={styles.promoPlaceholder}>Chọn voucher</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.promoRow}>
            <View style={styles.promoLeft}>
              <Ionicons name="gift-outline" size={24} color="#e71a0f" />
              <Text style={styles.promoLabel}>Mã giảm giá (Promo code)</Text>
            </View>
            <View style={styles.promoRight}>
              <Text style={styles.promoPlaceholder}>Nhập mã</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Tổng tiền */}
        <View style={[styles.section, styles.totalSection]}>
          <View style={styles.rowBetween}>
            <Text style={styles.totalLabel}>TỔNG CỘNG</Text>
            <Text style={styles.totalValue}>{finalTotal?.toLocaleString()} đ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút tiếp tục sang trang chọn phương thức thanh toán */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            console.log("Navigating to PaymentMethodsScreen...");
            console.log("Movie:", movie);
            console.log("FinalTotal:", finalTotal);
            console.log("SelectedSeats:", selectedSeats);

            navigation.navigate("PaymentMethodsScreen", {
              movie,
              finalTotal,
              selectedSeats,
              theater,
              screening
            });
          }}
        >
          <Text style={styles.confirmButtonText}>TIẾP TỤC</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  scrollContent: { padding: 15 },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  movieInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  confirmationPoster: {
    width: 80,
    height: 120,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  movieTextDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "flex-start",
  },
  movieName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    lineHeight: 22,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5
  },
  label: { fontSize: 15, color: "#555" },
  value: { fontSize: 15, fontWeight: "bold", color: "#333" },
  foodName: { fontSize: 14, color: "#333" },
  foodPrice: { fontSize: 14, color: "#555" },
  totalSection: { borderTopWidth: 2, borderTopColor: "#e71a0f" },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 20, fontWeight: "bold", color: "#e71a0f" },
  footer: { padding: 20, backgroundColor: "#fff" },
  confirmButton: {
    backgroundColor: "#e71a0f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  promoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  promoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoLabel: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
  },
  promoRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoPlaceholder: {
    fontSize: 14,
    color: "#999",
    marginRight: 5,
  },
});

export default TicketConfirmationScreen;