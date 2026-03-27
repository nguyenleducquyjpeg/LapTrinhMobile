import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const { width } = Dimensions.get("window");

const TransactionHistoryScreen = ({ navigation }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState("all");

    useEffect(() => {
        const currentUser = auth().currentUser;
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // Lắng nghe dữ liệu từ Firestore
        const unsubscribe = firestore()
            .collection("transactions")
            .doc(currentUser.uid)
            .collection("orders")
            .orderBy("transactionDate", "desc")
            .onSnapshot(
                (snapshot) => {
                    const transactionList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setTransactions(transactionList);
                    setLoading(false);
                },
                (error) => {
                    console.error("Lỗi lấy dữ liệu:", error);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, []);

    // Lọc giao dịch theo trạng thái
    const filteredTransactions =
        selectedFilter === "all"
            ? transactions
            : transactions.filter((t) => t.status === selectedFilter);

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "#4CAF50";
            case "pending":
                return "#FF9800";
            case "cancelled":
                return "#F44336";
            default:
                return "#666";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "completed":
                return "Đã hoàn thành";
            case "pending":
                return "Đang xử lý";
            case "cancelled":
                return "Đã hủy";
            default:
                return status;
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderTransactionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.transactionCard}
            onPress={() =>
                navigation.navigate("TransactionDetailScreen", { transaction: item })
            }
        >
            {/* Phần trên */}
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.movieTitle}>{item.movieTitle}</Text>
                    <Text style={styles.bookingCode}>Mã đặt: {item.bookingCode}</Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) },
                    ]}
                >
                    <Text style={styles.statusText}>
                        {getStatusLabel(item.status)}
                    </Text>
                </View>
            </View>

            {/* Phần giữa */}
            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.cinemaLocation}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.showtime}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="ticket-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                        {item.ticketCount} vé - Ghế: {item.seatNumbers.join(", ")}
                    </Text>
                </View>
            </View>

            {/* Phần dưới */}
            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>{formatDate(item.transactionDate)}</Text>
                <Text style={styles.priceText}>{item.totalPrice.toLocaleString("vi-VN")} đ</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#b80000" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView edges={["top", "left", "right"]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Filter Buttons */}
                <View style={styles.filterContainer}>
                    {["all", "completed", "pending", "cancelled"].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterButton,
                                selectedFilter === filter && styles.filterButtonActive,
                            ]}
                            onPress={() => setSelectedFilter(filter)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    selectedFilter === filter && styles.filterButtonTextActive,
                                ]}
                            >
                                {filter === "all"
                                    ? "Tất cả"
                                    : filter === "completed"
                                        ? "Hoàn thành"
                                        : filter === "pending"
                                            ? "Đang xử lý"
                                            : "Đã hủy"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Transaction List */}
                {filteredTransactions.length > 0 ? (
                    <FlatList
                        data={filteredTransactions}
                        renderItem={renderTransactionItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        marginBottom: 8,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },
    filterButtonActive: {
        backgroundColor: "#b80000",
        borderColor: "#b80000",
    },
    filterButtonText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    filterButtonTextActive: {
        color: "#fff",
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    transactionCard: {
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
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    movieTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 4,
    },
    bookingCode: {
        fontSize: 12,
        color: "#666",
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        color: "#fff",
        fontWeight: "600",
    },
    cardBody: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    infoText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 8,
        flex: 1,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#f9f9f9",
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    dateText: {
        fontSize: 11,
        color: "#999",
    },
    priceText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#b80000",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        marginTop: 16,
    },
});

export default TransactionHistoryScreen;