import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const TicketConfirmationScreen = ({ route, navigation }) => {
  // Nhận toàn bộ dữ liệu từ ProductScreen truyền sang
  const { movie, theater, screening, selectedSeats, foodItems, finalTotal } = route.params || {};

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
          <Text style={styles.movieName}>{movie?.movie_name}</Text>
          <Text style={styles.detailText}>{theater?.theater_name}</Text>
          <Text style={styles.detailText}>
            {screening?.screening_time ? new Date(screening.screening_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
            {" - "}
            {screening?.screening_time ? new Date(screening.screening_time).toLocaleDateString('vi-VN') : ""}
          </Text>
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
          onPress={() => navigation.navigate("PaymentMethodsScreen", {
            movie,
            finalTotal,
            selectedSeats
          })}
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
  movieName: { fontSize: 20, fontWeight: "bold", color: "#e71a0f", marginBottom: 5 },
  detailText: { fontSize: 14, color: "#666", marginBottom: 3 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 5 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
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
});

export default TicketConfirmationScreen;