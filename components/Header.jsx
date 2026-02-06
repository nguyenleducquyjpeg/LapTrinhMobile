import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Header = ({ searchQuery, onSearchChange }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Hàng 1: Menu - Logo/Brand - Thông báo */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => console.log("Open Menu")}>
          <Ionicons name="menu-outline" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <Image
            source={require("../assets/pngegg.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.notificationBtn} onPress={() => console.log("Notifications")}>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>7</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Hàng 2: Thanh tìm kiếm */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm tên phim, rạp..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => console.log("Voice Search")}>
            <Ionicons name="mic-outline" size={22} color="#888" />
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <TouchableOpacity onPress={() => console.log("Scan QR")}>
            <Ionicons name="qr-code-outline" size={22} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hàng 3: Dòng gợi ý nhanh dưới Search */}
      <TouchableOpacity style={styles.hintRow} onPress={() => console.log("Member info")}>
        <Ionicons name="sparkles" size={14} color="#fff" />
        <Text style={styles.hintText}>Ưu đãi thành viên ShopAI dành cho Quý. <Text style={styles.linkText}>Tìm hiểu ngay</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#b80000",
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  brandContainer: {
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 50,
  },
  notificationBtn: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -4,
    top: -2,
    backgroundColor: "#f57c00",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#f57c00",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchSection: {
    marginBottom: 10,
    marginTop: -5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30, // Bo góc cực đại kiểu pill
    paddingHorizontal: 15,
    height: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.9,
  },
  linkText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Header;