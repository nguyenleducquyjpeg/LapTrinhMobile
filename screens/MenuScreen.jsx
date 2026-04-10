import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MenuScreen = ({ navigation }) => {
    const quickMenus = [
        { icon: "film-outline", label: "Phim sắp chiếu", screen: "ComingSoon", color: "#FF6B6B" },
        { icon: "star-outline", label: "Phim yêu thích", screen: "Favorites", color: "#FFA500" },
        { icon: "map-outline", label: "Tìm rạp gần nhất", screen: "Theaters", color: "#4ECDC4" },
        { icon: "calendar-outline", label: "Lịch chiếu", screen: "Schedule", color: "#95E1D3" },
    ];

    const otherMenus = [
        { icon: "gift-outline", label: "Khuyến mãi & Ưu đãi", screen: "Promotions" },
        { icon: "ticket-outline", label: "Voucher của tôi", screen: "MyVouchers" },
        { icon: "history-outline", label: "Lịch xem phim", screen: "ViewingHistory" },
        { icon: "heart-outline", label: "Danh sách yêu thích", screen: "Favorites" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Menu</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Quick Access */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
                    <View style={styles.quickGrid}>
                        {quickMenus.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.quickItem, { backgroundColor: item.color }]}
                                onPress={() => navigation.navigate(item.screen)}
                            >
                                <Ionicons name={item.icon} size={32} color="#fff" />
                                <Text style={styles.quickLabel}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Other Menus */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Khác</Text>
                    {otherMenus.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => navigation.navigate(item.screen)}
                        >
                            <View style={styles.menuLeft}>
                                <MaterialCommunityIcons name={item.icon} size={24} color="#e71a0f" />
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: { fontSize: 18, fontWeight: "bold" },
    section: { paddingHorizontal: 16, marginVertical: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12, color: "#333" },
    quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    quickItem: {
        width: "48%",
        paddingVertical: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
    quickLabel: { color: "#fff", marginTop: 8, fontWeight: "bold", fontSize: 12, textAlign: "center" },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 8,
    },
    menuLeft: { flexDirection: "row", alignItems: "center" },
    menuLabel: { marginLeft: 12, fontSize: 16, color: "#333", fontWeight: "500" },
});

export default MenuScreen;