import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AccountInfoScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header - Chuyển icon sang màu đen */}
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => console.log("Mở thông báo")}>
            <Ionicons name="notifications-outline" size={26} color="#000" marginLeft={10} />
            {/* Nếu bạn muốn có chấm đỏ thông báo như ảnh mẫu */}
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Mở cài đặt")}>
            <Ionicons name="settings-outline" size={26} color="#000" marginRight={10} />
          </TouchableOpacity>
        </View>

        {/* Thông tin Avatar & Tên - Chữ màu đen */}
        <View style={styles.profileSection}>
          <Image
            source={require("../assets/Relight_00001_fzrmc_1757258799.jpg")}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Quý Nguyễn Lê Đức</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>MEMBER</Text>
          </View>
        </View>

        {/* Thẻ thành viên (Giữ nền trắng, thêm đổ bóng) */}
        <View style={styles.membershipCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="star-outline" size={20} color="#000" />
            <Text style={styles.cardTitle}>Ưu đãi thành viên</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#000" />
          </View>
          <View style={styles.barcodeContainer}>
            <Image
              source={require("../assets/z7474767855443_0fd06a1c3ed46011343a01191c0b3b97.jpg")} // Đảm bảo bạn đã bỏ ảnh vào thư mục assets
              style={styles.barcodeImage}
              resizeMode="contain"
            />
            <Text style={styles.barcodeNumber}>9991937911165854</Text>
          </View>
        </View>

        {/* Khu vực điểm - Chữ tối màu trên nền sáng */}
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

        {/* Danh sách chức năng - Icon màu tối */}
        <View style={styles.menuGrid}>
          <MenuItem icon="home-outline" label="Trang Chủ" color="#333" />
          <MenuItem icon="account-outline" label="Thành viên CGV" color="#333" />
          <MenuItem icon="office-building" label="Rạp CGV" color="#333" />
          <MenuItem icon="star-circle-outline" label="Rạp Đặc Biệt" color="#333" />
          <MenuItem icon="gift-outline" label="Tin mới & Ưu đãi" color="#333" />
          <MenuItem icon="ticket-confirmation-outline" label="Vé của tôi" color="#333" />
        </View>

        {/* Nút Đăng xuất */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, label, color }) => (
  <TouchableOpacity style={styles.menuItem}>
    <MaterialCommunityIcons name={icon} size={30} color={color} />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" }, // Nền xám nhạt
  scrollContent: { flexGrow: 1, backgroundColor: "#F5F5F5" },
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
    elevation: 4, // Đổ bóng cho Android
    shadowColor: "#000", // Đổ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: { flex: 1, marginLeft: 10, fontWeight: "bold", color: "#000" },
  barcodeContainer: { alignItems: "center", marginTop: 15 },
  barcodeContainer: {
    alignItems: "center",
    marginTop: 15
  },
  barcodeImage: {
    width: "100%",    // Chiều rộng phủ hết thẻ
    height: 70,       // Tăng chiều cao lên một chút để dễ quét
    marginBottom: 5   // Khoảng cách với dòng số bên dưới
  },
  barcodeNumber: {
    letterSpacing: 2,
    fontWeight: "bold",
    color: "#000"
  },
  barcodeNumber: { marginTop: 5, letterSpacing: 2, fontWeight: "bold", color: "#000" },
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
  logoutButton: { padding: 20, alignItems: "center" },
  logoutText: { color: "#C62828", fontSize: 16, fontWeight: "500" }
});

export default AccountInfoScreen;