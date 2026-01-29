import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

function formatTime(dateString) {
  if (!dateString) return "--:--";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getDayOfWeek(dateString) {
  if (!dateString) return "";
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const date = new Date(dateString);
  return daysOfWeek[date.getDay()];
}

function getFormattedDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
}


const SeatSelectionScreen = ({ route, navigation }) => {
  const { movie, screening, theater } = route.params || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const ticketPrice = 70000; // Giá vé giả định (VNĐ)

  const toggleSeat = (seatLocation) => {
    if (selectedSeats.includes(seatLocation)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatLocation));
    } else {
      setSelectedSeats([...selectedSeats, seatLocation]);
    }
  };

  const renderSeat = ({ item: seat }) => {
    const isSelected = selectedSeats.includes(seat.seat_location);
    const isOccupied = seat.status === false;

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Giao diện sáng */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{theater?.theater_name || "Chọn ghế"}</Text>
          <Text style={styles.headerSubtitle}>{movie?.movie_name}</Text>
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
          data={screening?.seats || []}
          renderItem={renderSeat}
          keyExtractor={(item) => item.seat_location}
          numColumns={8} // Điều chỉnh số cột cho phù hợp màn hình
          contentContainerStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
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

      {/* Footer - Thông tin thanh toán */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.selectedSeatsText}>
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
          onPress={() => navigation.navigate("ProductScreen", {
            movie,
            screening,
            theater,
            selectedSeats,
          })}
          style={[styles.continueButton, selectedSeats.length === 0 && { backgroundColor: '#ccc' }]}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.continueButtonText}>TIẾP TỤC</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  headerSubtitle: { fontSize: 13, color: "#666" },
  screenContainer: { alignItems: "center", marginVertical: 20 },
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
  selectedSeat: { backgroundColor: "#000000", borderColor: "#000000" },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  legendItem: { flexDirection: "row", alignItems: "center", mx: 10, marginHorizontal: 10 },
  legendBox: { width: 16, height: 16, marginRight: 5, borderRadius: 2, borderColor: "#DDD", borderWidth: 1 },
  legendLabel: { fontSize: 12, color: "#666" },
  footer: { padding: 16, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EEE" },
  footerTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15, alignItems: 'center' },
  selectedSeatsText: { fontSize: 14, color: "#333", flex: 1 },
  priceInfo: { alignItems: 'flex-end' },
  totalLabel: { fontSize: 12, color: "#666" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#e71a0f" },
  continueButton: {
    backgroundColor: "#e71a0f",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
  },
  continueButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default SeatSelectionScreen;
