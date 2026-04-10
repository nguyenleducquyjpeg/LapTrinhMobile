import React, { useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

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
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy suất chiếu từ Firestore
  useEffect(() => {
    fetchScreenings();
  }, []);

  const fetchScreenings = async () => {
    try {
      setLoading(true);
      const snapshot = await firestore()
        .collection('screenings')
        .get();

      const screeningsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Suất chiếu từ Firestore:", screeningsList);
      setScreenings(screeningsList);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy suất chiếu:", error);
      setLoading(false);
    }
  };

  // Nhóm suất chiếu theo rạp
  const groupedScreenings = screenings.reduce((acc, screening) => {
    const existing = acc.find(item => item.theater_id === screening.theater_id);
    if (existing) {
      existing.screenings.push(screening);
    } else {
      acc.push({
        theater_id: screening.theater_id,
        theater_name: screening.theater_name,
        screenings: [screening],
      });
    }
    return acc;
  }, []);

  const renderFooterTab = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={22} color="#666" />
        <Text style={styles.tabText}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("VoucherListScreen")}>
        <Ionicons name="ticket-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Voucher</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatAiButton}>
        <View style={styles.chatAiCircle}><Ionicons name="chatbubbles" size={26} color="#fff" /></View>
        <Text style={[styles.tabText, { marginTop: 28 }]}>ChatAI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("TransactionHistory")}>
        <Ionicons name="receipt-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Lịch sử</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("AccountInfo")}>
        <Ionicons name="person-outline" size={22} color="#666" />
        <Text style={styles.tabText}>Cá nhân</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#e71a0f" />
          <Text style={{ marginTop: 10 }}>Đang tải suất chiếu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{movie?.movie_name}</Text>
          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <Ionicons name={showMenu ? "close-outline" : "menu-outline"} size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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

          {/* Danh sách Suất Chiếu */}
          {groupedScreenings.map((theater, index) => (
            <View key={index} style={styles.theaterSection}>
              <View style={styles.theaterHeader}>
                <Text style={styles.theaterName}>{theater.theater_name}</Text>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </View>
              <Text style={styles.formatTag}>2D Phụ Đề</Text>
              <View style={styles.timeSlotsGrid}>
                {theater.screenings.map((slot, sIdx) => (
                  <TouchableOpacity
                    key={sIdx}
                    style={styles.timeSlot}
                    onPress={() => navigation.navigate("SeatSelection", {
                      movie: movie,
                      theater: theater,
                      screening: slot,
                    })}
                  >
                    <Text style={styles.timeText}>
                      {new Date(slot.screening_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
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
  dateListContainer: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dateItem: { alignItems: "center", paddingHorizontal: 15 },
  dateLabel: { color: "#999", fontSize: 12, marginBottom: 5 },
  dateText: { color: "#333", fontSize: 18, fontWeight: "bold" },
  activeText: { color: "#e71a0f" },
  activeNumber: { color: "#fff", backgroundColor: "#e71a0f", paddingHorizontal: 8, borderRadius: 15, overflow: 'hidden' },
  theaterSection: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  theaterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  theaterName: { fontSize: 15, fontWeight: '600', color: '#333' },
  formatTag: { color: '#D4AF37', fontSize: 12, marginVertical: 8 },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeSlot: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 5, width: (width - 60) / 4, alignItems: 'center' },
  timeText: { fontSize: 14, fontWeight: '500' },
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
  }
});

export default ShowTimesScreen;