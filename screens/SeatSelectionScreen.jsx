import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get("window");

const SeatSelectionScreen = ({ route, navigation }) => {
  const { movie, screening, theater } = route.params || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const ticketPrice = 70000;

  const getScreeningId = () => {
    if (screening?.id) return screening.id; // Sẽ lấy từ Firestore
    return null;
  };

  const screeningId = getScreeningId();

  // Lấy dữ liệu ghế từ Firestore khi component mount
  useEffect(() => {
    if (!screeningId) {
      Alert.alert("Lỗi", "Không có thông tin suất chiếu");
      navigation.goBack();
      return;
    }

    console.log("Screening ID:", screeningId);
    fetchSeats();
  }, [screeningId]);

  const fetchSeats = async () => {
    try {
      setLoading(true);

      if (!screeningId) {
        throw new Error("Screening ID không xác định");
      }

      // Lấy danh sách ghế từ suất chiếu
      const screeningDoc = await firestore()
        .collection('screenings')
        .doc(screeningId)
        .get();

      if (screeningDoc.exists) {
        const data = screeningDoc.data();
        console.log("Dữ liệu từ Firestore:", data);
        setSeats(data.seats || []);
      } else {
        console.log("Không tìm thấy screening, tạo ghế mặc định");
        await createDefaultSeats();
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy ghế:", error);
      Alert.alert("Lỗi", "Không thể tải ghế: " + error.message);
      setLoading(false);
    }
  };

  // Tạo ghế mặc định (8 cột x 10 hàng)
  const createDefaultSeats = async () => {
    try {
      if (!screeningId) {
        throw new Error("Screening ID không xác định");
      }

      const defaultSeats = [];
      const rows = 10;
      const cols = 8;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const rowLetter = String.fromCharCode(65 + i); // A, B, C, ...
          const seatNumber = j + 1;
          defaultSeats.push({
            seat_location: `${rowLetter}${seatNumber}`,
            status: true, // true = trống, false = đã đặt
          });
        }
      }

      console.log("Tạo ghế mặc định:", defaultSeats.length, "ghế");

      // Lưu ghế mặc định vào Firestore
      await firestore()
        .collection('screenings')
        .doc(screeningId)
        .set({ seats: defaultSeats }, { merge: true });

      setSeats(defaultSeats);
    } catch (error) {
      console.error("Lỗi tạo ghế mặc định:", error);
      Alert.alert("Lỗi", "Không thể tạo danh sách ghế");
    }
  };

  // Toggle ghế (không cần async)
  const toggleSeat = (seatLocation) => {
    const seat = seats.find(s => s.seat_location === seatLocation);

    // Nếu ghế không tồn tại hoặc đã đặt
    if (!seat || !seat.status) {
      Alert.alert("Thông báo", "Ghế này đã được đặt");
      return;
    }

    // Toggle chọn/bỏ chọn
    if (selectedSeats.includes(seatLocation)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatLocation));
    } else {
      setSelectedSeats([...selectedSeats, seatLocation]);
    }
  };

  // Lưu ghế đã chọn lên Firestore
  const saveSeatsToFirestore = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 ghế");
      return;
    }

    try {
      setSaving(true);
      const currentUser = auth().currentUser;

      if (!currentUser) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập");
        setSaving(false);
        return;
      }

      if (!screeningId) {
        throw new Error("Screening ID không xác định");
      }

      // Cập nhật trạng thái ghế (từ true -> false, tức là đã đặt)
      const updatedSeats = seats.map(seat => {
        if (selectedSeats.includes(seat.seat_location)) {
          return { ...seat, status: false }; // false = đã đặt
        }
        return seat;
      });

      console.log("Cập nhật ghế, số ghế đã đặt:", selectedSeats.length);

      // Lưu ghế cập nhật lên Firestore
      await firestore()
        .collection('screenings')
        .doc(screeningId)
        .update({
          seats: updatedSeats,
        });

      // Lưu lịch sử đặt ghế của người dùng
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('bookings')
        .add({
          movie: movie?.title || movie?.movie_name,
          theater: theater?.theater_name,
          screeningId: screeningId,
          seats: selectedSeats,
          bookingDate: new Date().toISOString(),
        });

      setSaving(false);

      // Chuyển tới trang tiếp theo
      navigation.navigate("ProductScreen", {
        movie,
        screening,
        theater,
        selectedSeats,
      });
    } catch (error) {
      setSaving(false);
      console.error("Lỗi lưu ghế:", error);
      Alert.alert("Lỗi", "Không thể đặt ghế: " + error.message);
    }
  };

  const renderSeat = ({ item: seat }) => {
    const isSelected = selectedSeats.includes(seat.seat_location);
    const isOccupied = !seat.status; // false = đã đặt

    return (
      <TouchableOpacity
        style={[
          styles.seat,
          isOccupied ? styles.occupiedSeat : isSelected ? styles.selectedSeat : styles.availableSeat,
        ]}
        disabled={isOccupied}
        onPress={() => toggleSeat(seat.seat_location)}
      >
        <Text style={[styles.seatText, (isSelected || isOccupied) && { color: "#fff" }]}>
          {seat.seat_location}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#e71a0f" />
          <Text style={{ marginTop: 10 }}>Đang tải ghế...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!seats || seats.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#999' }}>Không có dữ liệu ghế</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20, padding: 10, backgroundColor: '#e71a0f', borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={[styles.headerTitle, { marginTop: 16 }]}>
            {theater?.theater_name || "Chọn ghế"}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {movie?.movie_name || movie?.title || "Chọn phim"}
          </Text>
        </View>
      </View>

      {/* Screen Indicator */}
      <View style={styles.screenContainer}>
        <View style={styles.screenLine} />
        <Text style={styles.screenText}>MÀN HÌNH</Text>
      </View>

      {/* Seat Map */}
      <View style={styles.seatMapContainer}>
        <FlatList
          data={seats}
          renderItem={renderSeat}
          keyExtractor={(item) => item.seat_location}
          numColumns={8}
          contentContainerStyle={{ alignItems: 'center', paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        />
      </View>

      {/* Chú thích (Legend) */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.occupiedSeat]} />
          <Text style={styles.legendLabel}>Đã đặt</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.availableSeat]} />
          <Text style={styles.legendLabel}>Trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.selectedSeat]} />
          <Text style={styles.legendLabel}>Đang chọn</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.selectedSeatsText} numberOfLines={1}>
            Ghế: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn"}
          </Text>
          <View style={styles.priceInfo}>
            <Text style={styles.totalLabel}>Tạm tính:</Text>
            <Text style={styles.totalPrice}>
              {(selectedSeats.length * ticketPrice).toLocaleString()} đ
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={saveSeatsToFirestore}
          style={[
            styles.continueButton,
            (selectedSeats.length === 0 || saving) && { backgroundColor: '#ccc' }
          ]}
          disabled={selectedSeats.length === 0 || saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>TIẾP TỤC</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  headerSubtitle: { fontSize: 13, color: "#666", marginTop: 4 },
  screenContainer: { alignItems: "center", marginVertical: 15 },
  screenLine: {
    width: width * 0.8,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    marginBottom: 5
  },
  screenText: { color: "#999", fontSize: 12, fontWeight: "bold" },
  seatMapContainer: { flex: 1, paddingHorizontal: 10 },
  seat: {
    width: (width - 80) / 8,
    height: (width - 80) / 8,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
  },
  seatText: { fontSize: 10, fontWeight: "bold", color: "#333" },
  availableSeat: { backgroundColor: "#FFF", borderColor: "#DDD" },
  occupiedSeat: { backgroundColor: "#c40c0c", borderColor: "#BBB" },
  selectedSeat: { backgroundColor: "#e71a0f", borderColor: "#e71a0f" },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 8 },
  legendBox: { width: 16, height: 16, marginRight: 5, borderRadius: 2, borderColor: "#ffffff", borderWidth: 1 },
  legendLabel: { fontSize: 11, color: "#666" },
  footer: { padding: 16, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EEE" },
  footerTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, alignItems: 'center' },
  selectedSeatsText: { fontSize: 13, color: "#333", flex: 0.6 },
  priceInfo: { alignItems: 'flex-end', flex: 0.4 },
  totalLabel: { fontSize: 11, color: "#666" },
  totalPrice: { fontSize: 16, fontWeight: "bold", color: "#e71a0f" },
  continueButton: {
    backgroundColor: "#e71a0f",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
  },
  continueButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default SeatSelectionScreen;