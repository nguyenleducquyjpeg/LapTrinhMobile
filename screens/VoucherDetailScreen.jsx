import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get("window");

const VoucherDetailScreen = ({ route, navigation }) => {
    const { voucher: initialVoucher } = route.params || {};
    const [voucher, setVoucher] = useState(initialVoucher);
    const [loading, setLoading] = useState(!initialVoucher);

    // Lấy dữ liệu Voucher realtime từ Firestore
    useEffect(() => {
        if (!initialVoucher?.id) return;

        const unsubscribe = firestore()
            .collection('vouchers')
            .doc(initialVoucher.id)
            .onSnapshot(
                (doc) => {
                    if (doc.exists) {
                        setVoucher({
                            id: doc.id,
                            ...doc.data(),
                        });
                    }
                    setLoading(false);
                },
                (error) => {
                    console.error('Lỗi lấy voucher:', error);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [initialVoucher?.id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết Voucher</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#e71a0f" />
                </View>
            </SafeAreaView>
        );
    }

    if (!voucher) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết Voucher</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Không tìm thấy thông tin voucher</Text>
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const isExpired = (expireDate) => {
        return new Date(expireDate) < new Date();
    };

    const expired = isExpired(voucher.expireDate);
    const discountText = voucher.discountType === "percent"
        ? `Giảm ${voucher.discount}%`
        : `Giảm ${voucher.discount.toLocaleString()}đ`;

    const handleCopyCode = () => {
        Alert.alert("Thành công", `Đã sao chép mã: ${voucher.code}`);
    };

    const handleApplyVoucher = () => {
        if (expired) {
            Alert.alert("Lỗi", "Voucher này đã hết hạn");
            return;
        }
        if (voucher.isUsed) {
            Alert.alert("Lỗi", "Voucher này đã được sử dụng hết");
            return;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết Voucher</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Banner Discount */}
                <View style={[styles.discountBanner, expired && styles.discountBannerExpired]}>
                    {expired && (
                        <View style={styles.expiredBadge}>
                            <Text style={styles.expiredBadgeText}>ĐÃ HẾT HẠN</Text>
                        </View>
                    )}
                    <Text style={styles.discountBig}>{discountText}</Text>
                    <Text style={styles.discountSubtitle}>{voucher.title}</Text>
                </View>

                {/* Thông tin chính */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin Voucher</Text>

                    {/* Mã Voucher */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="barcode-outline" size={20} color="#e71a0f" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Mã Voucher</Text>
                                <Text style={styles.infoValue}>{voucher.code}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.copyBtn}
                            onPress={handleCopyCode}
                        >
                            <Ionicons name="copy-outline" size={20} color="#e71a0f" />
                            <Text style={styles.copyBtnText}>Sao chép</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Mô tả */}
                    <View style={styles.infoRow}>
                        <Ionicons name="information-circle-outline" size={20} color="#e71a0f" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Mô tả</Text>
                            <Text style={styles.infoValue}>{voucher.description}</Text>
                        </View>
                    </View>

                    {/* Loại giảm giá */}
                    <View style={styles.infoRow}>
                        <Ionicons name="pricetag-outline" size={20} color="#e71a0f" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Loại giảm giá</Text>
                            <Text style={styles.infoValue}>
                                {voucher.discountType === "percent" ? "Phần trăm (%)" : "Tiền cố định (đ)"}
                            </Text>
                        </View>
                    </View>

                    {/* Giá trị giảm */}
                    <View style={styles.infoRow}>
                        <Ionicons name="cash-outline" size={20} color="#e71a0f" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Giá trị giảm</Text>
                            <Text style={styles.infoValue}>
                                {voucher.discountType === "percent"
                                    ? `${voucher.discount}%`
                                    : `${voucher.discount.toLocaleString()}đ`
                                }
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Điều kiện áp dụng */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Điều kiện áp dụng</Text>

                    {/* Giá tối thiểu */}
                    {voucher.minPrice > 0 && (
                        <View style={styles.infoRow}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#e71a0f" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Giá tối thiểu</Text>
                                <Text style={styles.infoValue}>
                                    {voucher.minPrice.toLocaleString()}đ
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Giảm tối đa */}
                    {voucher.maxDiscount > 0 && (
                        <View style={styles.infoRow}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#e71a0f" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Giảm tối đa</Text>
                                <Text style={styles.infoValue}>
                                    {voucher.maxDiscount.toLocaleString()}đ
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Thời hạn sử dụng */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thời hạn sử dụng</Text>

                    {/* Hết hạn */}
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color={expired ? "#F44336" : "#e71a0f"}
                        />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Hết hạn vào</Text>
                            <Text style={[styles.infoValue, expired && styles.expiredText]}>
                                {formatDate(voucher.expireDate)}
                            </Text>
                        </View>
                    </View>

                    {/* Lượt còn lại */}
                    <View style={styles.infoRow}>
                        <Ionicons name="checkmark-done-outline" size={20} color="#e71a0f" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Lượt còn lại</Text>
                            <Text style={styles.infoValue}>
                                {voucher.maxUsage - voucher.usageCount}/{voucher.maxUsage}
                            </Text>
                        </View>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${((voucher.maxUsage - voucher.usageCount) / voucher.maxUsage) * 100}%`,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {Math.round(((voucher.maxUsage - voucher.usageCount) / voucher.maxUsage) * 100)}% còn lại
                        </Text>
                    </View>
                </View>

                {/* Trạng thái */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trạng thái</Text>

                    <View style={styles.statusContainer}>
                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: expired
                                        ? "#FFE0E0"
                                        : voucher.isUsed
                                            ? "#FFE0E0"
                                            : "#E8F5E9",
                                },
                            ]}
                        >
                            <Ionicons
                                name={
                                    expired
                                        ? "close-circle"
                                        : voucher.isUsed
                                            ? "close-circle"
                                            : "checkmark-circle"
                                }
                                size={20}
                                color={expired ? "#F44336" : voucher.isUsed ? "#F44336" : "#4CAF50"}
                            />
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color: expired ? "#F44336" : voucher.isUsed ? "#F44336" : "#4CAF50",
                                    },
                                ]}
                            >
                                {expired ? "Đã hết hạn" : voucher.isUsed ? "Đã sử dụng hết" : "Có thể sử dụng"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    scrollContent: {
        paddingBottom: 100,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        color: "#999",
    },

    /* BANNER DISCOUNT */
    discountBanner: {
        backgroundColor: "#e71a0f",
        padding: 30,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    discountBannerExpired: {
        backgroundColor: "#ccc",
    },
    expiredBadge: {
        position: "absolute",
        top: 15,
        right: 15,
        backgroundColor: "#F44336",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    expiredBadgeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 11,
    },
    discountBig: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
    },
    discountSubtitle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
    },

    /* SECTION */
    section: {
        backgroundColor: "#fff",
        marginTop: 12,
        padding: 16,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    /* INFO ROW */
    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    infoLeft: {
        flexDirection: "row",
        flex: 1,
        alignItems: "flex-start",
    },
    infoTextContainer: {
        flex: 1,
        marginLeft: 12,
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
        lineHeight: 20,
    },
    expiredText: {
        color: "#F44336",
    },

    /* COPY BUTTON */
    copyBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff5f5",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e71a0f",
    },
    copyBtnText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: "bold",
        color: "#e71a0f",
    },

    /* PROGRESS */
    progressContainer: {
        marginTop: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: "#eee",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#e71a0f",
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: "#999",
        textAlign: "right",
    },

    /* STATUS */
    statusContainer: {
        alignItems: "flex-start",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    statusText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "600",
    },
});

export default VoucherDetailScreen;