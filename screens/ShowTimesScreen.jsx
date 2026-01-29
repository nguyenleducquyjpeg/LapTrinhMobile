import React, { useState } from "react";
import { Text, View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_SCREENINGS } from "../data/mock_data";

const { width } = Dimensions.get('window');

// Hàm tạo mảng ngày - Tăng lên 14 ngày để kéo sang phải thoải mái
function generateDatesArray(numDays) {
  const daysOfWeek = ["CN", "2", "3", "4", "5", "6", "7"];
  const currentDate = new Date();
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const dayOfWeek = i === 0 ? "Hôm nay" : daysOfWeek[date.getDay()];
    const formattedDate = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    dates.push({ day, month, label: dayOfWeek, year, formattedDate });
  }
  return dates;
}

const dates = generateDatesArray(14); // Tăng lên 14 ngày

const ShowTimesScreen = ({ route, navigation }) => {
  // Lấy dữ liệu từ route (Sửa lỗi Property 'route' doesn't exist)
  const movie = route.params?.movie || { movie_name: "Thông tin phim" };
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Dark Mode */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{movie.movie_name.toUpperCase()}</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <Ionicons name="paper-plane-outline" size={24} color="#000000" />
          <Ionicons name="menu-outline" size={28} color="#000000" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner khuyến mãi giả lập */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>ĐỒNG GIÁ 70K/VÉ CHO CÁC SUẤT CHIẾU SAU 22H00</Text>
        </View>

        {/* Thanh chọn ngày */}
        <View style={styles.dateSelectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScrollContent}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date.formattedDate}
                style={styles.dateItem}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateLabel, selectedDate.formattedDate === date.formattedDate && styles.activeText]}>
                  {date.label}
                </Text>
                <Text style={[styles.dateText, selectedDate.formattedDate === date.formattedDate && styles.activeNumber]}>
                  {date.day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.fullDateDisplay}>
            Thứ {selectedDate.label === "Hôm nay" ? "Tư" : selectedDate.label} {selectedDate.day} tháng {selectedDate.month}, {selectedDate.year}
          </Text>
        </View>

        {/* Hiển thị danh sách rạp từ MOCK_SCREENINGS */}
        {MOCK_SCREENINGS.map((theater, index) => (
          <View key={index} style={styles.theaterSection}>
            <View style={styles.theaterHeader}>
              <Text style={styles.theaterName}>
                <Text style={{ color: '#e71a0f', fontWeight: 'bold' }}>CGV </Text>
                {theater.theater_name}
              </Text>
              <Ionicons name="chevron-up" size={24} color="#555" />
            </View>
            <Text style={styles.formatTag}>● 2D</Text>
            <View style={styles.timeSlotsGrid}>
              {theater.screenings.map((slot, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.timeSlot}
                  onPress={() => navigation.navigate("SeatSelection", { movie: movie, theater: theater, screening: slot })}>
                  <Text style={styles.timeText}>{formatTime(slot.screening_time)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Nav */}
      <View style={styles.footerNav}>
        <View style={styles.navItem}><Text style={styles.navCount}>2</Text><Text style={styles.navLabel}>Gợi Ý Cho Bạn</Text></View>
        <View style={styles.navItem}><Text style={styles.navCount}>84</Text><Text style={styles.navLabel}>Tất Cả Các Rạp</Text></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" }, // Nền trắng 
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE"
  },
  headerTitle: { color: "#333333", fontSize: 16, fontWeight: "bold", flex: 1, textAlign: 'center' },
  promoBanner: { backgroundColor: '#F9F9F9', margin: 10, padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#EEEEEE' },
  promoText: { color: '#666666', fontSize: 11, textAlign: 'center' },
  dateSelectorContainer: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#EEEEEE" },
  dateScrollContent: { paddingHorizontal: 10 },
  dateItem: { alignItems: "center", paddingHorizontal: 15 },
  dateLabel: { color: "#999999", fontSize: 12, marginBottom: 5 },
  dateText: { color: "#333333", fontSize: 18, fontWeight: "bold" },
  activeText: { color: "#e71a0f" },
  activeNumber: { color: "#FFFFFF", backgroundColor: "#e71a0f", paddingHorizontal: 8, borderRadius: 15, overflow: 'hidden' },
  fullDateDisplay: { color: '#333333', textAlign: 'center', marginTop: 15, fontWeight: 'bold', fontSize: 14 },
  theaterSection: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  theaterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  theaterName: { color: '#333333', fontSize: 15 },
  formatTag: { color: '#D4AF37', fontSize: 12, marginVertical: 10 },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeSlot: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    padding: 8,
    borderRadius: 5,
    width: (width - 70) / 4,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  timeText: { color: '#333333', fontSize: 14, fontWeight: '500' },
  footerNav: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD'
  },
  navItem: { flex: 1, alignItems: 'center' },
  navCount: { color: '#333333', fontSize: 18, fontWeight: 'bold' },
  navLabel: { color: '#999999', fontSize: 11 }
});

export default ShowTimesScreen;