import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AccountInfoScreen = () => {
  const navigation = useNavigation();

  // --- HÀM RENDER FOOTER ĐỒNG BỘ VỚI TRANG HOME ---
  const renderFooterTab = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Trang chủ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => console.log("Voucher")}>
        <Ionicons name="ticket-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Voucher</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.chatAiButton} onPress={() => console.log("Chat AI")}>
        <View style={styles.chatAiCircle}>
          <Ionicons name="chatbubbles" size={30} color="#fff" />
        </View>
        <Text style={[styles.tabText, { marginTop: 28 }]}>ChatAI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => console.log("Khuyến mãi")}>
        <Ionicons name="gift-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Khuyến mãi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("AccountInfo")}>
        <Ionicons name="person" size={24} color="#b80000" />
        <Text style={[styles.tabText, { color: '#b80000' }]}>Cá nhân</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}></View>
            <TouchableOpacity onPress={() => console.log("Mở thông báo")}>
              <View style={{ position: 'relative', marginRight: 15 }}>
                <Ionicons name="notifications-outline" size={26} color="#000" style={{ marginLeft: 280 }} />
                <View style={styles.notificationDot} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("Mở cài đặt")}>
              <Ionicons name="settings-outline" size={26} color="#000" marginRight={10} />
            </TouchableOpacity>
          </View>

          {/* Thông tin Avatar & Tên */}
          <View style={styles.profileSection}>
            <Image
              source={require("../assets/Relight_00001_fzrmc_1757258799.jpg")}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Nguyễn Lê Đức Quý</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>MEMBER</Text>
            </View>
          </View>

          {/* Thẻ thành viên */}
          <View style={styles.membershipCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="star-outline" size={20} color="#000" />
              <Text style={styles.cardTitle}>Ưu đãi thành viên</Text>
              <MaterialIcons name="keyboard-arrow-right" size={24} color="#000" />
            </View>
            <View style={styles.barcodeContainer}>
              <Image
                source={require("../assets/z7474767855443_0fd06a1c3ed46011343a01191c0b3b97.jpg")}
                style={styles.barcodeImage}
                resizeMode="contain"
              />
              <Text style={styles.barcodeNumber}>9991937911165854</Text>
            </View>
          </View>

          {/* Khu vực điểm */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tổng Chi Tiêu 2026</Text>
              <Text style={styles.statValue}>0 đ</Text>
            </View>
            <View style={[styles.statBox, { borderLeftWidth: 0.5, borderLeftColor: "#ddd" }]}>
              <Text style={styles.statLabel}>Điểm Thưởng</Text>
              <Text style={styles.statValue}>20</Text>
            </View>
          </View>

          {/* Danh sách chức năng */}
          <View style={styles.menuGrid}>
            <MenuItem icon="home-outline" label="Trang Chủ" color="#333" />
            <MenuItem icon="account-outline" label="Thành viên CGV" color="#333" />
            <MenuItem icon="office-building" label="Rạp CGV" color="#333" />
            <MenuItem icon="star-circle-outline" label="Rạp Đặc Biệt" color="#333" />
            <MenuItem icon="gift-outline" label="Tin mới & Ưu đãi" color="#333" />
            <MenuItem icon="ticket-confirmation-outline" label="Vé của tôi" color="#333" />
          </View>

          {/* Nút Đăng xuất */}
          <View style={styles.logoutSection}>
            <TouchableOpacity
              style={styles.customLogoutButton}
              onPress={() => navigation.navigate("Login")} // Thêm dòng này để chuyển về trang Login
            >
              <Text style={styles.customLogoutText}>ĐĂNG XUẤT</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Phiên bản 1.0.0 (ShopAI)</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Hiển thị Footer */}
      {renderFooterTab()}
    </View>
  );
};

const MenuItem = ({ icon, label, color }) => (
  <TouchableOpacity style={styles.menuItem}>
    <MaterialCommunityIcons name={icon} size={30} color={color} />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 }, // Thêm paddingBottom để không bị footer che nút logout
  headerButtons: { flexDirection: "row", justifyContent: "space-between", padding: 15 },
  profileSection: { alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: "#ddd" },
  userName: { color: "#000", fontSize: 20, fontWeight: "bold", marginTop: 10 },
  memberBadge: { backgroundColor: "#E0E0E0", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 5 },
  memberText: { color: "#C62828", fontSize: 12, fontWeight: "bold" },
  membershipCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: { flex: 1, marginLeft: 10, fontWeight: "bold", color: "#000" },
  barcodeContainer: { alignItems: "center", marginTop: 15 },
  barcodeImage: { width: "100%", height: 70, marginBottom: 5 },
  barcodeNumber: { letterSpacing: 2, fontWeight: "bold", color: "#000" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd"
  },
  statBox: { flex: 1, padding: 15, alignItems: "center" },
  statLabel: { color: "#757575", fontSize: 12 },
  statValue: { color: "#000", fontSize: 22, fontWeight: "bold", marginTop: 5 },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", padding: 10, backgroundColor: "#fff", marginTop: 20 },
  menuItem: { width: "33.33%", alignItems: "center", marginVertical: 20 },
  menuLabel: { color: "#333", fontSize: 12, marginTop: 8, textAlign: "center" },
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 120, // Tăng khoảng cách để không bị Footer che và thoáng mắt hơn
    alignItems: 'center',
  },
  customLogoutButton: {
    backgroundColor: "#b71c1c", // Màu đỏ chủ đạo của ShopAI
    width: '100%',
    height: 50,
    borderRadius: 28, // Tạo độ bo tròn hoàn hảo như hình mẫu
    justifyContent: 'center',
    alignItems: 'center',
    // Đổ bóng cho Android
    elevation: 8,
    // Đổ bóng cho iOS
    shadowColor: "#e71a0f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  customLogoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1, // Tạo khoảng cách chữ cho chuyên nghiệp
  },
  versionText: {
    fontSize: 13,
    color: '#999',
    marginTop: 15,
    fontWeight: '500',
  },
  notificationDot: {
    position: 'absolute',
    right: 15,
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red'
  },

  // --- STYLES CHO FOOTER (Sao chép từ HomeScreen) ---
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

export default AccountInfoScreen;