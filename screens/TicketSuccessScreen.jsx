import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const TicketSuccessScreen = ({ route, navigation }) => {
    const { movie, selectedSeats, finalTotal, bookingId, bookingDate } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Giao dịch thành công</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.ticketCard}>
                    {/* Phần trên của vé */}
                    <View style={styles.ticketTop}>
                        <Text style={styles.movieName}>{movie?.movie_name}</Text>
                        <Text style={styles.theaterName}>Vincom Quảng Ngãi - P.03</Text>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Ngày</Text>
                                <Text style={styles.infoValue}>04/02/2026</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Giờ chiếu</Text>
                                <Text style={styles.infoValue}>20:00</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Ghế</Text>
                                <Text style={styles.infoValue}>{selectedSeats?.join(", ")}</Text>
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
                            <QRCode value={bookingId} size={160} />
                        </View>
                        <Text style={styles.bookingIdText}>Mã đặt vé: {bookingId}</Text>
                        <Text style={styles.noteText}>Đưa mã này cho nhân viên để vào rạp</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.homeBtn}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Text style={styles.homeBtnText}>QUAY LẠI TRANG CHỦ</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#e71a0f" }, // Màu đỏ thương hiệu
    header: { flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: "center" },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    scrollContent: { padding: 20, alignItems: "center" },

    ticketCard: { backgroundColor: "#fff", width: width * 0.85, borderRadius: 20, overflow: "hidden", elevation: 10 },
    ticketTop: { padding: 25 },
    movieName: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 5 },
    theaterName: { fontSize: 14, color: "#666", marginBottom: 20 },

    infoGrid: { flexDirection: "row", justifyContent: "space-between" },
    infoLabel: { fontSize: 12, color: "#999", marginBottom: 5 },
    infoValue: { fontSize: 15, fontWeight: "bold", color: "#333" },

    dividerContainer: { flexDirection: "row", alignItems: "center", height: 30, backgroundColor: "#fff" },
    leftCutout: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#e71a0f", marginLeft: -10 },
    rightCutout: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#e71a0f", marginRight: -10 },
    dashLine: { flex: 1, height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: "#ddd", borderRadius: 1 },

    ticketBottom: { padding: 25, alignItems: "center" },
    qrContainer: { padding: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee", borderRadius: 10 },
    bookingIdText: { marginTop: 15, fontSize: 16, fontWeight: "bold", color: "#333" },
    noteText: { fontSize: 12, color: "#999", marginTop: 5 },

    homeBtn: { marginTop: 30, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, borderWidth: 1, borderColor: "#fff" },
    homeBtnText: { color: "#fff", fontWeight: "bold" }
});

export default TicketSuccessScreen;