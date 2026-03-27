import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PaymentMethodsScreen = ({ navigation, route }) => {
  const { movie, finalTotal, selectedSeats, theater, screening } = route?.params || {};

  const [selectedMethod, setSelectedMethod] = useState("visa");
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft === 0) {
      Alert.alert("Hết thời gian", "Giao dịch đã hết hạn, vui lòng đặt lại.", [
        { text: "OK", onPress: () => navigation.navigate("Home") }
      ]);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const paymentMethods = [
    { id: "visa", name: "Thẻ ATM / Visa / Master", icon: "card-outline", color: "#1A1F71" },
    { id: "momo", name: "Ví MoMo", icon: "wallet-outline", color: "#A50064" },
    { id: "zalo", name: "ZaloPay", icon: "aperture-outline", color: "#0088FF" },
    { id: "shopee", name: "ShopeePay", icon: "bag-handle-outline", color: "#EE4D2D" },
  ];

  const handlePayment = () => {
    Alert.alert(
      "Xác nhận thanh toán",
      "Bạn có chắc chắn muốn thực hiện giao dịch này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Thanh toán",
          onPress: async () => {
            const bookingId = "QUY-" + Math.floor(Math.random() * 1000000);
            try {
              const user = auth().currentUser;
              if (user) {
                await firestore()
                  .collection('transactions')
                  .doc(user.uid)
                  .collection('orders')
                  .add({
                    movieTitle: movie?.title || movie?.movie_name,
                    cinemaLocation: theater?.theater_name || "Chưa cập nhật",
                    showtime: screening?.screening_time ?
                      new Date(screening.screening_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }) : "Chưa cập nhật",
                    ticketCount: selectedSeats?.length || 0,
                    seatNumbers: selectedSeats || [],
                    totalPrice: finalTotal || 0,
                    status: "completed",
                    transactionDate: new Date(),
                    paymentMethod: selectedMethod,
                    bookingCode: bookingId,
                  });
              }
            } catch (error) {
              console.error("Lỗi lưu giao dịch:", error);
            }
            navigation.navigate("TicketSuccessScreen", {
              movie,
              theater,
              screening,
              selectedSeats,
              finalTotal,
              paymentMethod: selectedMethod,
              bookingId,
              bookingDate: new Date().toLocaleString('vi-VN')
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với Timer */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#e71a0f" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>THANH TOÁN</Text>
          <Text style={styles.timerText}>Thời gian giữ ghế: {formatTime(timeLeft)}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Số tiền thanh toán */}
        <View style={styles.amountSection}>
          <Text style={styles.label}>Tổng số tiền</Text>
          <Text style={styles.amountText}>
            {finalTotal ? finalTotal.toLocaleString() : "0"}đ
          </Text>
          <Text style={styles.feeNote}>(Đã bao gồm phí tiện ích 2.000đ)</Text>
        </View>

        {/* Thông tin phim tóm tắt */}
        <View style={styles.movieSummary}>
          {/* Dùng movie?.title hoặc movie?.movie_name */}
          <Text style={styles.movieName}>
            {movie?.title || movie?.movie_name || "Chưa có tên phim"}
          </Text>
          <Text style={styles.movieDetail}>Ghế: {selectedSeats?.join(", ") || "Chưa chọn"}</Text>
        </View>

        <Text style={styles.sectionTitle}>CHỌN PHƯƠNG THỨC THANH TOÁN</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodItem,
              selectedMethod === method.id && styles.methodItemActive
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.methodLeft}>
              <Ionicons name={method.icon} size={24} color={method.color} />
              <Text style={styles.methodName}>{method.name}</Text>
            </View>
            <Ionicons
              name={selectedMethod === method.id ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={selectedMethod === method.id ? "#e71a0f" : "#ccc"}
            />
          </TouchableOpacity>
        ))}

        <View style={styles.policySection}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.policyText}>
            Vé đã mua không thể đổi hoặc trả lại. Vui lòng kiểm tra kỹ thông tin.
          </Text>
        </View>
      </ScrollView>

      {/* Nút thanh toán cố định bên dưới */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>THANH TOÁN</Text>
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
    borderBottomColor: "#eee",
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  timerText: { fontSize: 12, color: "#e71a0f", fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  amountSection: { alignItems: "center", marginBottom: 25 },
  label: { fontSize: 14, color: "#888" },
  amountText: { fontSize: 32, fontWeight: "bold", color: "#e71a0f" },
  feeNote: { fontSize: 12, color: "#999", fontStyle: 'italic', marginTop: 5 },
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
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 15 },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10
  },
  methodItemActive: { borderColor: "#e71a0f", backgroundColor: "#fff5f5" },
  methodLeft: { flexDirection: "row", alignItems: "center" },
  methodName: { marginLeft: 15, fontSize: 15, color: "#333" },
  policySection: { flexDirection: 'row', marginTop: 20, paddingHorizontal: 5 },
  policyText: { fontSize: 12, color: "#666", marginLeft: 8, flex: 1, lineHeight: 18 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "#eee" },
  payButton: { backgroundColor: "#e71a0f", height: 55, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});

export default PaymentMethodsScreen;