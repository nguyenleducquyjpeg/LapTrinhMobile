import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const TransactionDetailScreen = ({ route, navigation }) => {
    const { transaction } = route.params || {};

    if (!transaction) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết vé</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Không tìm thấy thông tin vé</Text>
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        let date;

        // Xử lý cả Timestamp và Date object
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }

        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

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

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết vé</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Vé */}
                <View style={styles.ticketCard}>
                    {/* Phần trên của vé */}
                    <View style={styles.ticketTop}>
                        <Text style={styles.movieTitle}>{transaction.movieTitle}</Text>
                        <Text style={styles.cinemaName}>{transaction.cinemaLocation}</Text>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Ngày chiếu</Text>
                                <Text style={styles.infoValue}>
                                    {transaction.showtime?.split(" ")[0] || "N/A"}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Giờ chiếu</Text>
                                <Text style={styles.infoValue}>
                                    {transaction.showtime?.split(" ")[1] || "N/A"}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Ghế</Text>
                                <Text style={styles.infoValue}>
                                    {transaction.seatNumbers?.join(", ") || "N/A"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Đường cắt răng cưa giữa vé */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.leftCutout} />
                        <View style={styles.dashLine} />
                        <View style={styles.rightCutout} />
                    </View>

                    {/* Phần dưới của vé - QR Code */}
                    <View style={styles.ticketBottom}>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={transaction.bookingCode || "N/A"}
                                size={160}
                            />
                        </View>
                        <Text style={styles.bookingCodeText}>
                            Mã đặt vé: {transaction.bookingCode}
                        </Text>
                        <Text style={styles.noteText}>
                            Đưa mã này cho nhân viên để vào rạp
                        </Text>
                    </View>
                </View>

                {/* Chi tiết giao dịch */}
                <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Thông tin giao dịch</Text>

                    {/* Trạng thái */}
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { marginBottom: 10 }]}>Trạng thái</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(transaction.status), marginBottom: 10 },
                            ]}
                        >
                            <Text style={styles.statusText}>
                                {getStatusLabel(transaction.status)}
                            </Text>
                        </View>
                    </View>

                    {/* Số vé */}
                    <View style={styles.detailRow}>
                        <Ionicons name="ticket-outline" size={18} color="#666" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Số lượng vé</Text>
                            <Text style={styles.detailValue}>
                                {transaction.ticketCount} vé
                            </Text>
                        </View>
                    </View>

                    {/* Địa điểm */}
                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={18} color="#666" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Rạp chiếu</Text>
                            <Text style={styles.detailValue}>
                                {transaction.cinemaLocation}
                            </Text>
                        </View>
                    </View>

                    {/* Thời gian */}
                    <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={18} color="#666" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Suất chiếu</Text>
                            <Text style={styles.detailValue}>
                                {transaction.showtime}
                            </Text>
                        </View>
                    </View>

                    {/* Phương thức thanh toán */}
                    <View style={styles.detailRow}>
                        <Ionicons name="card-outline" size={18} color="#666" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Phương thức thanh toán</Text>
                            <Text style={styles.detailValue}>
                                {transaction.paymentMethod || "N/A"}
                            </Text>
                        </View>
                    </View>

                    {/* Ngày đặt */}
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={18} color="#666" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Ngày đặt</Text>
                            <Text style={styles.detailValue}>
                                {formatDate(transaction.transactionDate)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Giá tiền */}
                <View style={styles.priceSection}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Tổng tiền</Text>
                        <Text style={styles.priceValue}>
                            {transaction.totalPrice?.toLocaleString("vi-VN") || "0"} đ
                        </Text>
                    </View>
                </View>

                {/* Nút hành động */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.shareButton}>
                        <Ionicons name="share-social-outline" size={20} color="#fff" />
                        <Text style={styles.shareButtonText}>Chia sẻ</Text>
                    </TouchableOpacity>

                    {transaction.status === "completed" && (
                        <TouchableOpacity style={styles.printButton}>
                            <Ionicons name="print-outline" size={20} color="#fff" />
                            <Text style={styles.printButtonText}>In vé</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Nút quay lại trang chủ */}
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Text style={styles.homeButtonText}>QUAY LẠI TRANG CHỦ</Text>
                </TouchableOpacity>
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
        padding: 16,
        paddingBottom: 30,
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

    // === VÉ ===
    ticketCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        overflow: "hidden",
        elevation: 5,
        marginBottom: 20,
    },
    ticketTop: {
        padding: 25,
        backgroundColor: "#fff",
    },
    movieTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 5,
    },
    cinemaName: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
    },
    infoGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoItem: {
        alignItems: "center",
    },
    infoLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },

    // === Divider ===
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 30,
        backgroundColor: "#fff",
    },
    leftCutout: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#f8f8f8",
        marginLeft: -10,
    },
    rightCutout: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#f8f8f8",
        marginRight: -10,
    },
    dashLine: {
        flex: 1,
        height: 1,
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#ddd",
    },

    // === VÉ BOTTOM ===
    ticketBottom: {
        padding: 25,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    qrContainer: {
        padding: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 10,
    },
    bookingCodeText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    noteText: {
        fontSize: 12,
        color: "#999",
        marginTop: 5,
    },

    // === CHI TIẾT GIAO DỊCH ===
    detailSection: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 10,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    detailContent: {
        flex: 1,
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },

    // === STATUS BADGE ===
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 10,
    },
    statusText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "600",
    },

    // === GIÁ ===
    priceSection: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    priceValue: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#b80000",
    },

    // === BUTTONS ===
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        gap: 10,
    },
    shareButton: {
        flex: 1,
        backgroundColor: "#007AFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 10,
    },
    shareButtonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
        fontSize: 14,
    },
    printButton: {
        flex: 1,
        backgroundColor: "#34C759",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 10,
    },
    printButtonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
        fontSize: 14,
    },
    homeButton: {
        backgroundColor: "#b80000",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    homeButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default TransactionDetailScreen;