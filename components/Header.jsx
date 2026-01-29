import React, { useRef, useEffect } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
// Xóa dòng import Icon cũ vì gây lỗi trên Android Studio nếu chưa cấu hình
// import Icon from "react-native-vector-icons/Ionicons"; 
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Header = ({ searchQuery, onSearchChange }) => {
  const searchInputRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchInputRef.current.focus();
    }
  }, [searchQuery]);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => console.log("Open Menu")}>
        <Ionicons name="menu-outline" size={30} color="#000" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          ref={searchInputRef}
          placeholder="Search by movie names"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoFocus={searchQuery.length > 0}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("AccountInfo")}>
        <Image
          source={require("../assets/user_icon.png")}
          style={{ width: 28, height: 28 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    gap: 4
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 5,
    paddingVertical: 8,
    fontSize: 14,
  },
});

export default Header;