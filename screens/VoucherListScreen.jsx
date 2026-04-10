import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get("window");

const VoucherListScreen = ({ navigation }) => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy dữ liệu Vouchers từ Firestore
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

    const handleCopyCode = (code) => {
        Alert.alert("Thành công", `Đã sao chép mã: ${code}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const isExpired = (expireDate) => {
        return new Date(expireDate) < new Date();
    };

    const handleVoucherPress = (voucher) => {
        navigation.navigate("VoucherDetailScreen", { voucher });
    };

    const renderVoucherItem = ({ item }) => {
        const expired = isExpired(item.expireDate);
        const discountText = item.discountType === "percent"
            ? `Giảm ${item.discount}%`
            : `Giảm ${item.discount.toLocaleString()}đ`;

        return (
            <TouchableOpacity
                style={[
                    styles.voucherCard,
                    expired && styles.voucherCardExpired,
                ]}
                onPress={() => handleVoucherPress(item)}
                activeOpacity={0.7}
            >
                {/* Overlay nếu hết hạn */}
                {expired && (
                    <View style={styles.expiredOverlay}>
                        <Text style={styles.expiredText}>Đã hết hạn</Text>
                    </View>
                )}

                {/* Nội dung */}
                <View style={styles.voucherContent}>
                    {/* Phần giảm giá */}
                    <View style={styles.discountSection}>
                        <Text style={styles.discountText}>{discountText}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#e71a0f" />
                    </View>

                    {/* Thông tin voucher */}
                    <Text style={styles.voucherTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.voucherDescription} numberOfLines={2}>
                        {item.description}
                    </Text>

                    {/* Mã voucher */}
                    <View style={styles.codeSection}>
                        <Text style={styles.codeLabel}>Mã: </Text>
                        <Text style={styles.codeText}>{item.code}</Text>
                        <TouchableOpacity
                            onPress={() => handleCopyCode(item.code)}
                            style={styles.copyButton}
                        >
                            <Ionicons name="copy-outline" size={16} color="#e71a0f" />
                        </TouchableOpacity>
                    </View>

                    {/* Thông tin sử dụng */}
                    <View style={styles.footerSection}>
                        <View style={styles.usageInfo}>
                            <Ionicons name="calendar-outline" size={14} color="#999" />
                            <Text style={styles.footerText}>
                                Hết hạn: {formatDate(item.expireDate)}
                            </Text>
                        </View>
                        <View style={styles.usageInfo}>
                            <Ionicons name="checkmark-done-outline" size={14} color="#999" />
                            <Text style={styles.footerText}>
                                Còn: {item.maxUsage - item.usageCount}
                            </Text>
                        </View>
                    </View>

                    {/* Điều kiện */}
                    {item.minPrice > 0 && (
                        <View style={styles.conditionSection}>
                            <Ionicons name="information-circle-outline" size={13} color="#666" />
                            <Text style={styles.conditionText}>
                                Áp dụng tối thiểu: {item.minPrice.toLocaleString()}đ
                            </Text>
                        </View>
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
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Voucher & Khuyến mãi</Text>
                <TouchableOpacity>
                    <Ionicons name="search-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                    <Text style={[styles.tabText, styles.tabTextActive]}>Voucher</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Khuyến mãi</Text>
                </TouchableOpacity>
            </View>

            {/* Voucher List */}
            <FlatList
                data={vouchers}
                renderItem={renderVoucherItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="ticket-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>Không có voucher nào</Text>
                    </View>
                }
            />
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
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderBottomWidth: 3,
        borderBottomColor: "transparent",
    },
    tabActive: {
        borderBottomColor: "#e71a0f",
    },
    tabText: {
        fontSize: 14,
        color: "#999",
        fontWeight: "500",
    },
    tabTextActive: {
        color: "#e71a0f",
        fontWeight: "bold",
    },
    listContent: {
        padding: 12,
    },
    voucherCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: "hidden",
    },
    voucherCardExpired: {
        opacity: 0.6,
    },
    expiredOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    expiredText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    voucherContent: {
        padding: 12,
        justifyContent: "space-between",
    },
    discountSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    discountText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#e71a0f",
    },
    voucherTitle: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 4,
    },
    voucherDescription: {
        fontSize: 11,
        color: "#666",
        marginBottom: 8,
    },
    codeSection: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 8,
    },
    codeLabel: {
        fontSize: 11,
        color: "#999",
        fontWeight: "500",
    },
    codeText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
    },
    copyButton: {
        padding: 4,
    },
    footerSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    usageInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    footerText: {
        fontSize: 10,
        color: "#999",
        marginLeft: 4,
    },
    conditionSection: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    conditionText: {
        fontSize: 10,
        color: "#666",
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 100,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        marginTop: 16,
    },
});

export default VoucherListScreen;