import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Dùng bộ icon thống nhất
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const items = [
  {
    id: "1",
    name: "SNOOPY SPORT 2025 SINGLE",
    price: 249000,
    description: "01 Ly nước Snoopy Sport 2025 (không kèm nước)\n01 Coca-cola 32oz\n01 Bắp ngọt lớn 44oz ...",
    image: "https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2025/102025/2025_Snoopy_N_O_350x495.png",
  },
  {
    id: "2",
    name: "PREMIUM MY COMBO",
    price: 115000,
    description: "1 Bắp Ngọt Lớn + 1 Nước Siêu Lớn + 1 Snack\n- Áp dụng giá Lễ, Tết cho các sản phẩm bắp nước đối với suất chiếu vào ngày Lễ, Tết ...",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ3mllEoRlqtmBynDL9Kp5Bgr21KehO1EJsoy2v8Bn8g&s",
  },
  {
    id: "3",
    name: "MY COMBO",
    price: 95000,
    description: "1 Bắp Ngọt Lớn + 1 Nước Siêu Lớn\n- Áp dụng giá Lễ, Tết cho các sản phẩm bắp nước đối với suất chiếu vào ngày Lễ, Tết ...",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXa3xBL9AlE3BE3D8gTyRzq_eof7Qv8ncCOqgTV7hIfQ&s",
  },
  {
    id: "4",
    name: "KHÔ GÀ CAO BẰNG",
    price: 120000,
    description: "Khô gà xé sợi Cao Bằng vị truyền thống đặc trưng, đậm đà, thơm ngon, giòn dai, ăn là ghiền ...",
    image: "data:image/jpeg;base64,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"
  }
];

const ProductScreen = ({ navigation, route }) => {
  const { selectedSeats = [], movie, theater, screening } = route.params || {};
  const seatTotalPrice = selectedSeats.length * 70000;

  const [quantities, setQuantities] = useState({});

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