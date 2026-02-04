import React, { useState } from "react"; // Thêm useState để quản lý việc chọn
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const PaymentMethodsScreen = ({ navigation, route }) => {
  const { movie, finalTotal, selectedSeats } = route?.params || {};

  // 1. Tạo state để lưu id phương thức đang chọn (mặc định chọn cái đầu tiên)
  const [selectedMethod, setSelectedMethod] = useState("visa");

  const paymentMethods = [
    { id: "visa", name: "Thẻ ATM / Visa / Master", icon: "card-outline" },
    { id: "momo", name: "Ví MoMo", icon: "wallet-outline" },
    { id: "zalo", name: "ZaloPay", icon: "aperture-outline" },
    { id: "shopee", name: "ShopeePay", icon: "bag-handle-outline" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#e71a0f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THANH TOÁN</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.amountSection}>
          <Text style={styles.label}>Số tiền thanh toán</Text>
          <Text style={styles.amountText}>{finalTotal?.toLocaleString()} đ</Text>
        </View>

        <View style={styles.movieSummary}>
          <Text style={styles.movieName}>{movie?.movie_name?.toUpperCase()}</Text>
          <Text style={styles.movieDetail}>Số lượng ghế: {selectedSeats?.length}</Text>
        </View>

        <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>

        {paymentMethods.map((method) => {
          // 2. Kiểm tra xem phương thức này có đang được chọn không
          const isSelected = selectedMethod === method.id;

          return (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodItem, isSelected && styles.methodItemActive]} // Thêm style khi chọn
              onPress={() => setSelectedMethod(method.id)} // 3. Cập nhật phương thức khi nhấn
            >
              <View style={styles.methodLeft}>
                <Ionicons
                  name={method.icon}
                  size={24}
                  color={isSelected ? "#e71a0f" : "#555"}
                />
                <Text style={[styles.methodName, isSelected && styles.methodNameActive]}>
                  {method.name}
                </Text>
              </View>
              {/* 4. Thay đổi icon Radio button tùy theo trạng thái chọn */}
              <Ionicons
                name={isSelected ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={isSelected ? "#e71a0f" : "#ddd"}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => alert(`Bạn đã chọn thanh toán bằng: ${paymentMethods.find(m => m.id === selectedMethod).name}`)}
        >
          <Text style={styles.payButtonText}>XÁC NHẬN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  content: { flex: 1, padding: 20 },
  amountSection: { alignItems: "center", marginBottom: 30 },
  label: { fontSize: 14, color: "#888" },
  amountText: { fontSize: 32, fontWeight: "bold", color: "#e71a0f", marginTop: 5 },
  movieSummary: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#eee"
  },
  movieName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  movieDetail: { fontSize: 13, color: "#666", marginTop: 5 },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#333", marginBottom: 15 },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 8
  },
  methodItemActive: {
    backgroundColor: "#fff5f5", // Màu nền nhẹ khi chọn
  },
  methodLeft: { flexDirection: "row", alignItems: "center" },
  methodName: { marginLeft: 15, fontSize: 15, color: "#333" },
  methodNameActive: { color: "#e71a0f", fontWeight: "bold" },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "#eee" },
  payButton: {
    backgroundColor: "#e71a0f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  payButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});

export default PaymentMethodsScreen;