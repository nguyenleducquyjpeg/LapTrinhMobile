import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { uploadAndSaveAvatar } from '../utils/uploadAvatarToFirebase';

const AccountInfoScreen = () => {
  const navigation = useNavigation();

  // ✅ State lưu thông tin người dùng
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // ✅ Lấy dữ liệu người dùng từ Firestore khi component mount
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Lấy user hiện tại từ Firebase Auth
      const currentUser = auth().currentUser;

      if (currentUser) {
        // Lấy dữ liệu từ Firestore
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          console.log("User data:", userData);
          setUser({
            uid: currentUser.uid,
            email: userData.email || currentUser.email,
            fullName: userData.fullName || "Người dùng",
            phoneNumber: userData.phoneNumber || "N/A",
            createdAt: userData.createdAt,
          });
        } else {
          // Nếu không có dữ liệu, dùng thông tin từ Auth
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            fullName: currentUser.displayName || "Người dùng",
            phoneNumber: "N/A",
            createdAt: null,
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const handleLogout = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await auth().signOut();
              navigation.navigate("Login");
            } catch (error) {
              Alert.alert("Lỗi", "Không thể đăng xuất: " + error.message);
            }
          }
        }
      ]
    );
  };

  // --- HÀM RENDER FOOTER ĐỒNG BỘ VỚI TRANG HOME ---
  const renderFooterTab = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Trang chủ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("VoucherListScreen")}>
        <Ionicons name="ticket-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Voucher</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chatAiButton}
        onPress={() => navigation.navigate("ChatAi")}
      >
        <View style={styles.chatAiCircle}>
          <Ionicons name="chatbubbles" size={30} color="#fff" />
        </View>
        <Text style={[styles.tabText, { marginTop: 28 }]}>ChatAI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("TransactionHistory")}>
        <Ionicons name="receipt-outline" size={24} color="#666" />
        <Text style={styles.tabText}>Lịch sử</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("AccountInfo")}>
        <Ionicons name="person" size={24} color="#b80000" />
        <Text style={[styles.tabText, { color: '#b80000' }]}>Cá nhân</Text>
      </TouchableOpacity>
    </View>
  );

  // ✅ Hiển thị loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#b80000" />
          <Text style={{ marginTop: 10 }}>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
              <Ionicons name="settings-outline" size={26} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Thông tin Avatar & Tên từ Firestore */}
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Ionicons name="person-circle-outline" size={80} color="#adadad" />
            </View>
            <Text style={styles.userName}>{user?.fullName || "Người dùng"}</Text>
            <Text style={styles.userEmail}>{user?.email || "email@example.com"}</Text>
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
              <View style={styles.barcodePlaceholder}>
                <Ionicons name="barcode-outline" size={60} color="#ddd" />
              </View>
              <Text style={styles.barcodeNumber}>{user?.uid?.substring(0, 16) || "N/A"}</Text>
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

          {/* Hiển thị thông tin chi tiết từ Firestore */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Thông tin tài khoản</Text>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#e71a0f" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#e71a0f" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoValue}>{user?.phoneNumber || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#e71a0f" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Ngày tạo tài khoản</Text>
                <Text style={styles.infoValue}>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                    : "N/A"
                  }
                </Text>
              </View>
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
              onPress={handleLogout}
            >
              <Text style={styles.customLogoutText}>ĐĂNG XUẤT</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
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
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  headerButtons: { flexDirection: "row", justifyContent: "space-between", padding: 15 },
  profileSection: { alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff5f5",
    overflow: 'hidden',
  },
  userName: { color: "#000", fontSize: 20, fontWeight: "bold", marginTop: 10 },
  userEmail: { color: "#666", fontSize: 14, marginTop: 4 },
  memberBadge: { backgroundColor: "#E0E0E0", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 10 },
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
  barcodePlaceholder: {
    width: "100%",
    height: 70,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  barcodeNumber: { letterSpacing: 2, fontWeight: "bold", color: "#000", fontSize: 12 },
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

  // Style cho thông tin chi tiết
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  menuGrid: { flexDirection: "row", flexWrap: "wrap", padding: 10, backgroundColor: "#fff", marginTop: 20 },
  menuItem: { width: "33.33%", alignItems: "center", marginVertical: 20 },
  menuLabel: { color: "#333", fontSize: 12, marginTop: 8, textAlign: "center" },
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 120,
    alignItems: 'center',
  },
  customLogoutButton: {
    backgroundColor: "#b71c1c",
    width: '100%',
    height: 50,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#e71a0f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  customLogoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
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
    position: 'absolute', top: -30,
  }
});

export default AccountInfoScreen;