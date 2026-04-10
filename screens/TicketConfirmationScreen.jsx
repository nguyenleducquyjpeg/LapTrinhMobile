import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, FlatList, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from '@react-native-firebase/firestore';

const TicketConfirmationScreen = ({ route, navigation }) => {
  const { movie, theater, screening, selectedSeats, foodItems, finalTotal: originalTotal } = route.params || {};

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu vouchers từ Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('vouchers')
      .onSnapshot(
        (snapshot) => {
          const voucherList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVouchers(voucherList);
          setLoading(false);
        },
        (error) => {
          console.error('Lỗi lấy vouchers:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  // Tính toán giá sau khi giảm
  const calculateDiscount = () => {
    if (!selectedVoucher) return 0;

    let discountAmount = 0;

    if (selectedVoucher.discountType === "percent") {
      discountAmount = (originalTotal * selectedVoucher.discount) / 100;
    } else {
      discountAmount = selectedVoucher.discount;
    }

    // Không vượt quá maxDiscount
    const maxDiscount = selectedVoucher.maxDiscount || 999999;
    return Math.min(discountAmount, maxDiscount);
  };

  const discountAmount = calculateDiscount();
  const finalPrice = originalTotal - discountAmount;

  // Format ngày
  const formatScreeningDate = (dateString) => {
    if (!dateString) return "Đang cập nhật";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return "Đang cập nhật";
    }
  };

  // Format giờ
  const formatScreeningTime = (dateString) => {
    if (!dateString) return "Đang cập nhật";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return "Đang cập nhật";
    }
  };

  const isExpired = (expireDate) => {
    return new Date(expireDate) < new Date();
  };

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
    setModalVisible(false);
  };

  const handleRemoveVoucher = () => {
    Alert.alert(
      "Bỏ chọn Voucher",
      "Bạn có chắc chắn muốn bỏ chọn voucher này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Bỏ chọn",
          onPress: () => {
            setSelectedVoucher(null);
          }
        }
      ]
    );
  };

  const renderVoucherOption = ({ item }) => {
    const expired = isExpired(item.expireDate);
    if (expired) return null;

    const discountText = item.discountType === "percent"
      ? `Giảm ${item.discount}%`
      : `Giảm ${item.discount.toLocaleString()}đ`;

    const isSelected = selectedVoucher?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.voucherOption,
          isSelected && styles.voucherOptionSelected
        ]}
        onPress={() => handleVoucherSelect(item)}
      >
        <View style={styles.voucherOptionContent}>
          <View style={styles.voucherOptionLeft}>
            <View style={styles.voucherInfoContainer}>
              <Text style={styles.voucherOptionTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.voucherOptionCode}>Mã: {item.code}</Text>
              {item.minPrice > 0 && (
                <Text style={styles.voucherMinPrice}>
                  Tối thiểu: {item.minPrice.toLocaleString()}đ
                </Text>
              )}
            </View>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#e71a0f" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#e71a0f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>XÁC NHẬN VÉ</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Thông tin phim */}
        <View style={styles.section}>
          <View style={styles.movieInfoRow}>
            <Image
              source={{ uri: movie?.image || movie?.movie_poster }}
              style={styles.confirmationPoster}
              resizeMode="cover"
            />

            <View style={styles.movieTextDetails}>
              <Text style={styles.movieName} numberOfLines={2}>
                {movie?.title || movie?.movie_name}
              </Text>
              <Text style={styles.detailText}>{theater?.theater_name}</Text>

              <Text style={styles.detailText}>
                <Ionicons name="time-outline" size={14} color="#666" />
                {" "}
                {formatScreeningTime(screening?.screening_time)}
                {" - "}
                {formatScreeningDate(screening?.screening_time)}
              </Text>

              <Text style={styles.detailText}>
                <Ionicons name="location-outline" size={14} color="#666" /> Suất chiếu: 2D Phụ đề
              </Text>
            </View>
          </View>
        </View>

        {/* Ghế đã chọn */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Ghế đã chọn:</Text>
            <Text style={styles.value}>{selectedSeats?.join(", ")}</Text>
          </View>
        </View>

        {/* Bắp nước đã chọn */}
        {foodItems?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bắp & Nước</Text>
            {foodItems.map((item) => (
              <View key={item.id} style={styles.rowBetween}>
                <Text style={styles.foodName}>{item.quantity}x {item.name}</Text>
                <Text style={styles.foodPrice}>{(item.price * item.quantity).toLocaleString()} đ</Text>
              </View>
            ))}
          </View>
        )}

        {/* Chọn Voucher */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHỌN VOUCHER / MÃ GIẢM GIÁ</Text>

          <TouchableOpacity
            style={[styles.voucherSelector, selectedVoucher && styles.voucherSelectorActive]}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.voucherSelectorLeft}>
              <Ionicons name="ticket-outline" size={24} color="#e71a0f" />
              <View style={styles.voucherSelectorText}>
                <Text style={styles.voucherSelectorLabel}>
                  {selectedVoucher ? "Đã chọn voucher" : "Chọn voucher"}
                </Text>
                {selectedVoucher ? (
                  <Text style={styles.voucherSelectorValue} numberOfLines={1}>
                    {selectedVoucher.code} - {selectedVoucher.title}
                  </Text>
                ) : (
                  <Text style={styles.voucherSelectorPlaceholder}>Nhấn để chọn voucher</Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#e71a0f" />
          </TouchableOpacity>
        </View>

        {/* Tóm tắt giá */}
        <View style={styles.priceSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.priceLabel}>Giá vé + Bắp nước:</Text>
            <Text style={styles.priceValue}>{originalTotal.toLocaleString()} đ</Text>
          </View>

          {selectedVoucher && discountAmount > 0 && (
            <>
              <View style={styles.divider} />
              <View style={[styles.rowBetween, styles.discountRow]}>
                <Text style={styles.discountLabel}>Giảm giá:</Text>
                <Text style={styles.discountValue}>-{discountAmount.toLocaleString()} đ</Text>
              </View>
            </>
          )}

          <View style={styles.divider} />
          <View style={[styles.rowBetween, styles.totalRow]}>
            <Text style={styles.totalLabel}>TỔNG CỘNG</Text>
            <Text style={styles.totalValue}>{finalPrice.toLocaleString()} đ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút tiếp tục */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            console.log("Navigating to PaymentMethodsScreen...");
            console.log("Movie:", movie);
            console.log("FinalTotal:", finalPrice);
            console.log("SelectedVoucher:", selectedVoucher);

            navigation.navigate("PaymentMethodsScreen", {
              movie,
              finalTotal: finalPrice,
              selectedSeats,
              theater,
              screening,
              selectedVoucher
            });
          }}
        >
          <Text style={styles.confirmButtonText}>TIẾP TỤC THANH TOÁN</Text>
        </TouchableOpacity>
      </View>

      {/* Modal chọn voucher */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chọn Voucher</Text>
            <View style={{ width: 28 }} />
          </View>

          <FlatList
            data={vouchers.filter(v => !isExpired(v.expireDate))}
            renderItem={renderVoucherOption}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.voucherListContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="ticket-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Không có voucher nào</Text>
              </View>
            }
          />

          {/* Nút bỏ chọn */}
          {selectedVoucher && (
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.removeVoucherBtn}
                onPress={handleRemoveVoucher}
              >
                <Ionicons name="trash-outline" size={20} color="#ffffff" />
                <Text style={styles.removeVoucherBtnText}>Bỏ chọn Voucher</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  scrollContent: { padding: 15, paddingBottom: 80 },

  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },

  movieInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  confirmationPoster: {
    width: 80,
    height: 120,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  movieTextDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "flex-start",
  },
  movieName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: { fontSize: 13, color: "#666" },
  value: { fontSize: 13, fontWeight: "bold", color: "#333" },
  foodName: { fontSize: 12, color: "#333" },
  foodPrice: { fontSize: 12, color: "#666" },

  voucherSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  voucherSelectorActive: {
    backgroundColor: "#fff5f5",
    borderColor: "#e71a0f",
  },
  voucherSelectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  voucherSelectorText: {
    marginLeft: 10,
    flex: 1,
  },
  voucherSelectorLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  voucherSelectorValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#e71a0f",
  },
  voucherSelectorPlaceholder: {
    fontSize: 12,
    color: "#999",
  },

  discountInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 6,
  },
  discountText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "bold",
    color: "#4CAF50",
  },

  priceSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  priceLabel: { fontSize: 13, color: "#666" },
  priceValue: { fontSize: 13, color: "#333" },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  discountRow: {
    marginVertical: 5,
  },
  discountLabel: { fontSize: 13, color: "#e71a0f", fontWeight: "bold" },
  discountValue: { fontSize: 13, color: "#e71a0f", fontWeight: "bold" },

  totalRow: {
    marginVertical: 5,
  },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#e71a0f" },

  footer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  confirmButton: {
    backgroundColor: "#e71a0f",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  voucherListContent: {
    padding: 12,
    paddingBottom: 100,
  },
  voucherOption: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    overflow: "hidden",
  },
  voucherOptionSelected: {
    borderWidth: 2,
    borderColor: "#e71a0f",
  },
  voucherOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  voucherOptionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  discountBadgeText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  voucherInfoContainer: {
    flex: 1,
  },
  voucherOptionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  voucherOptionCode: {
    fontSize: 13,
    color: "#999",
    marginBottom: 3,
  },
  voucherMinPrice: {
    fontSize: 12,
    color: "#e71a0f",
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
  },

  modalFooter: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  removeVoucherBtn: {
    backgroundColor: "#e71a0f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e71a0f",
    borderRadius: 8,
    paddingVertical: 12,
  },
  removeVoucherBtnText: {
    marginLeft: 8,
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 16,
  },
});

export default TicketConfirmationScreen;