import React, { useState } from "react";
import { Text, View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_SCREENINGS } from "../data/mock_data";

const { width } = Dimensions.get('window');

// --- HÀM TẠO MẢNG NGÀY ---
function generateDatesArray(numDays) {
  const daysOfWeek = ["CN", "2", "3", "4", "5", "6", "7"];
  const currentDate = new Date();
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    const day = String(date.getDate());
    const dayOfWeek = i === 0 ? "Hôm nay" : daysOfWeek[date.getDay()];
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    dates.push({ day, label: dayOfWeek, formattedDate });
  }
  return dates;
}

const dates = generateDatesArray(14);

const ShowTimesScreen = ({ route, navigation }) => {
  const { movie } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(dates[0].formattedDate);
  const [showMenu, setShowMenu] = useState(false);

  // --- FOOTER ĐIỀU HƯỚNG ---
  const renderFooterTab = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={22} color="#666" />
        <Text style={styles.tabText}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}><Ionicons name="ticket-outline" size={22} color="#666" /><Text style={styles.tabText}>Voucher</Text></TouchableOpacity>
      <TouchableOpacity style={styles.chatAiButton}>
        <View style={styles.chatAiCircle}><Ionicons name="chatbubbles" size={26} color="#fff" /></View>
        <Text style={[styles.tabText, { marginTop: 28 }]}>ChatAI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}><Ionicons name="gift-outline" size={22} color="#666" /><Text style={styles.tabText}>Khuyến mãi</Text></TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("AccountInfo")}><Ionicons name="person-outline" size={22} color="#666" /><Text style={styles.tabText}>Cá nhân</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={28} color="#000" /></TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{movie?.movie_name}</Text>
          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}><Ionicons name={showMenu ? "close-outline" : "menu-outline"} size={28} color="#000" /></TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Banner Khuyến Mãi */}
          <View style={styles.bannerContainer}>
            <Image source={{ uri: "https://homepage.momocdn.net/blogscontents/momo-upload-api-240607153809-638533714890870208.jpg" }} style={styles.bannerImage} />
          </View>

          {/* Thanh Chọn Ngày */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={dates}
            keyExtractor={(item) => item.formattedDate}
            contentContainerStyle={styles.dateListContainer}
            renderItem={({ item }) => {
              const isActive = selectedDate === item.formattedDate;
              return (
                <TouchableOpacity style={styles.dateItem} onPress={() => setSelectedDate(item.formattedDate)}>
                  <Text style={[styles.dateLabel, isActive && styles.activeText]}>{item.label}</Text>
                  <Text style={[styles.dateText, isActive && styles.activeNumber]}>{item.day}</Text>
                </TouchableOpacity>
              );
            }}
          />

          {showMenu ? (
            <View style={styles.menuOverlay}>
              <Text style={styles.menuHeading}>Gợi ý rạp gần bạn</Text>
              {MOCK_SCREENINGS.slice(0, 2).map((theater, index) => (
                <TouchableOpacity key={index} style={styles.theaterOption}>
                  <Ionicons name="location-outline" size={20} color="#e71a0f" /><Text style={styles.theaterOptionText}>{theater.theater_name}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.divider} /><Text style={styles.menuHeading}>Tất cả rạp</Text>
              <TouchableOpacity style={styles.theaterOption}><Text style={styles.theaterOptionText}>TP. Hồ Chí Minh</Text></TouchableOpacity>
              <TouchableOpacity style={styles.theaterOption}><Text style={styles.theaterOptionText}>Hà Nội</Text></TouchableOpacity>
            </View>
          ) : (
            MOCK_SCREENINGS.map((item, index) => (
              <View key={index} style={styles.theaterSection}>
                <View style={styles.theaterHeader}><Text style={styles.theaterName}>{item.theater_name}</Text><Ionicons name="chevron-forward" size={18} color="#999" /></View>
                <Text style={styles.formatTag}>2D Phụ Đề</Text>
                <View style={styles.timeSlotsGrid}>
                  {item.screenings.map((slot, sIdx) => (
                    <TouchableOpacity
                      key={sIdx}
                      style={styles.timeSlot}
                      // THÊM LOGIC ĐIỀU HƯỚNG TẠI ĐÂY
                      onPress={() => navigation.navigate("SeatSelection", {
                        movie: movie,
                        theater: item,
                        screening: slot
                      })}
                    >
                      <Text style={styles.timeText}>
                        {new Date(slot.screening_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
      {renderFooterTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  bannerContainer: { padding: 10 },
  bannerImage: { width: '100%', height: 100, borderRadius: 8 },
  dateListContainer: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dateItem: { alignItems: "center", paddingHorizontal: 15 },
  dateLabel: { color: "#999", fontSize: 12, marginBottom: 5 },
  dateText: { color: "#333", fontSize: 18, fontWeight: "bold" },
  activeText: { color: "#e71a0f" },
  activeNumber: { color: "#fff", backgroundColor: "#e71a0f", paddingHorizontal: 8, borderRadius: 15, overflow: 'hidden' },
  menuOverlay: { padding: 15, backgroundColor: '#fdfdfd' },
  menuHeading: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10, marginTop: 5 },
  theaterOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#ddd' },
  theaterOptionText: { fontSize: 15, marginLeft: 10, color: '#333' },
  divider: { height: 15 },
  theaterSection: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  theaterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  theaterName: { fontSize: 15, fontWeight: '600', color: '#333' },
  formatTag: { color: '#D4AF37', fontSize: 12, marginVertical: 8 },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeSlot: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 5, width: (width - 60) / 4, alignItems: 'center' },
  timeText: { fontSize: 14, fontWeight: '500' },
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

export default ShowTimesScreen;