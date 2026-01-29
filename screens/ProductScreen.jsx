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
    image: "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/572332606_1317460380420729_1483077768025352857_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEBdAYb8Jj4cEH1rTbmnqBBfgsB8ANqVhF-CwHwA2pWEZDAEx6UXVb31eMD2EJ_9SDjUWk2BKKB1qX0b2yaCRK3&_nc_ohc=ndaU6EjO-74Q7kNvwEEcSOl&_nc_oc=AdmF4sMBjkIgD4ZF38QFtRutidO87ItCmqODtXU98zvYHqyOOvtMkv6vfVa8MklrmYSUVYagMu14OXfUakrAe_NM&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=EPDUTtOPMI8uxF3SEyQtZQ&oh=00_Afp54rijAyet_KjkTIBGx88dxdKEo7JxTpGMYddjhrMzQg&oe=69800FC4",
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
];

const ProductScreen = ({ navigation, route }) => {
  const { selectedSeats = [], movie, theater, screening } = route.params || {};
  const seatTotalPrice = selectedSeats.length * 70000;

  const [quantities, setQuantities] = useState({});

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
          <Text style={styles.headerInfo}>Cinema 4, 28/01/26, 23:20~1:40</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={28} color="#e71a0f" />
        </TouchableOpacity>
      </View>

      {/* Banner khuyến mãi đỏ */}
      <View style={styles.promoBanner}>
        <Image require={{ uri: 'https://cdn-icons-png.flaticon.com/512/3408/3408506.png' }} style={styles.promoIcon} />
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
          onPress={() => console.log("Chuyển thanh toán")}
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
  promoIcon: { width: 30, height: 30, marginRight: 10, tintColor: '#fff' },
  promoText: { color: '#fff', fontSize: 11, flex: 1 },
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