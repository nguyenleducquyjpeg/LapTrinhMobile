import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductsFromFirestore } from "../utils/uploadProductsToFirestore";
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get("window");

const ProductScreen = ({ navigation, route }) => {
  const { selectedSeats = [], movie, theater, screening } = route.params || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const seatTotalPrice = selectedSeats.length * 70000;

  useEffect(() => {
    // Lấy dữ liệu sản phẩm từ Firestore
    const unsubscribe = getProductsFromFirestore((products) => {
      setItems(products);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Đang tải sản phẩm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Thêm hàm format ngày và giờ
  const formatScreeningDate = (dateString) => {
    if (!dateString) return "Đang cập nhật";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch (e) {
      return "Đang cập nhật";
    }
  };

  const formatScreeningTime = (dateString) => {
    if (!dateString) return "--:--";
    try {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch (e) {
      return "--:--";
    }
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
  };

  const productTotalPrice = items.reduce(
    (total, item) => total + item.price * (quantities[item.id] || 0),
    0
  );

  const finalTotal = seatTotalPrice + productTotalPrice;

  const renderItem = ({ item }) => {
    const quantity = quantities[item.id] || 0;

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name.toUpperCase()} - {item.price.toLocaleString()} đ</Text>
          <Text style={styles.itemDescription} numberOfLines={3}>{item.description}</Text>
          <View style={styles.quantityContainer}>
            <View style={styles.quantityBox}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDecrement(item.id)} style={styles.btnMinus}>
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.btnPlus}>
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Giao diện sáng */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#e71a0f" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerCinema}><Text style={{ color: '#e71a0f', fontWeight: 'bold' }}>CGV</Text> {theater?.theater_name || "Crescent Mall"}</Text>
          <Text style={styles.headerInfo}>
            Cinema 4, {formatScreeningDate(screening?.screening_time)}, {formatScreeningTime(screening?.screening_time)}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={28} color="#e71a0f" />
        </TouchableOpacity>
      </View>

      {/* Banner khuyến mãi đỏ */}
      <View style={styles.promoBanner}>
        <Image source={require("../assets/iconbap.png")} style={styles.promoIcon} />
        <Text style={styles.promoText}>Áp dụng giá Lễ, Tết cho các sản phẩm bắp nước đối với giao dịch có suất chiếu vào ngày Lễ, Tết.</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Footer tính tiền */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tiền vé ({selectedSeats.length} ghế):</Text>
          <Text style={styles.totalValue}>{seatTotalPrice.toLocaleString()} đ</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tiền bắp nước:</Text>
          <Text style={styles.totalValue}>{productTotalPrice.toLocaleString()} đ</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#ddd' }]}>
          <Text style={styles.finalLabel}>TỔNG CỘNG:</Text>
          <Text style={styles.finalPrice}>{finalTotal.toLocaleString()} đ</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TicketConfirmationScreen", {
              movie,          // Thông tin phim
              theater,        // Thông tin rạp
              screening,      // Suất chiếu
              selectedSeats,  // Danh sách ghế đã chọn
              foodItems: items.filter(item => (quantities[item.id] || 0) > 0).map(item => ({
                ...item,
                quantity: quantities[item.id]
              })), // Chỉ gửi những món bắp nước đã chọn số lượng > 0
              finalTotal,     // Tổng tiền cuối cùng
            });
          }}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>THANH TOÁN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  headerTitleContainer: { flex: 1, marginLeft: 10 },
  headerCinema: { fontSize: 16, color: "#333" },
  headerInfo: { fontSize: 12, color: "#888" },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#ff4d4d',
    padding: 10,
    alignItems: 'center'
  },
  promoIcon: { width: 35, height: 30, marginRight: 10 },
  promoText: { color: '#fff', fontSize: 12, flex: 1 },
  listContent: { paddingBottom: 20 },
  itemContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff"
  },
  itemImage: { width: 80, height: 100, borderRadius: 5 },
  itemDetails: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 14, fontWeight: "bold", color: "#333" },
  itemDescription: { fontSize: 12, color: "#777", marginVertical: 5 },
  quantityContainer: { flexDirection: "row", marginTop: 5 },
  quantityBox: {
    width: 40,
    height: 30,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginRight: 10
  },
  quantityText: { fontWeight: "bold", color: "#333" },
  btnMinus: {
    width: 35,
    height: 30,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginRight: 5
  },
  btnPlus: {
    width: 35,
    height: 30,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  btnText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  footer: { padding: 20, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#eee" },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  totalLabel: { fontSize: 13, color: '#666' },
  totalValue: { fontSize: 13, color: '#333' },
  finalLabel: { fontSize: 16, fontWeight: 'bold' },
  finalPrice: { fontSize: 20, fontWeight: 'bold', color: '#e71a0f' },
  continueButton: { backgroundColor: "#e71a0f", alignItems: "center", padding: 15, borderRadius: 10, marginTop: 15 },
  continueButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ProductScreen;