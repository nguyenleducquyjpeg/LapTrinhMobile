import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsScreen = ({ navigation }) => {
    const settingsList = [
        {
            icon: "lock-outline",
            label: "Thay đổi mật khẩu",
            onPress: () => navigation.navigate("ChangePasswordScreen"),
        },
        {
            icon: "account-edit-outline",
            label: "Cập nhật thông tin cá nhân",
            onPress: () => navigation.navigate("EditProfileScreen"),
        },
        {
            icon: "home-map-marker",
            label: "Quản lý địa chỉ",
            onPress: () => navigation.navigate("AddressManagement"),
        },
        {
            icon: "bell-outline",
            label: "Cấu hình thông báo",
            onPress: () => navigation.navigate("NotificationSettings"),
        },
        {
            icon: "help-circle-outline",
            label: "Trung tâm trợ giúp",
            onPress: () => navigation.navigate("HelpCenter"),
        },
        {
            icon: "file-document-outline",
            label: "Điều khoản & Chính sách",
            onPress: () => navigation.navigate("TermsAndPolicy"),
        },
        {
            icon: "information-outline",
            label: "Về ứng dụng",
            onPress: () => showAboutApp(),
        },
    ];

    const showAboutApp = () => {
        Alert.alert(
            "Về ứng dụng",
            "CGV Cinema\nPhiên bản: 1.0.0\nDeveloper: DUCQUY\n© 2026"
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cài đặt</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {settingsList.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.settingItem}
                        onPress={item.onPress}
                    >
                        <View style={styles.settingLeft}>
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={24}
                                color="#e71a0f"
                            />
                            <Text style={styles.settingLabel}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                ))}

                {/* Các setting không điều hướng */}
                <View style={styles.divider} />

                <View style={styles.settingGroup}>
                    <Text style={styles.groupTitle}>Khác</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <MaterialCommunityIcons
                                name="language-markdown-outline"
                                size={24}
                                color="#e71a0f"
                            />
                            <Text style={styles.settingLabel}>Ngôn ngữ</Text>
                        </View>
                        <Text style={styles.settingValue}>Tiếng Việt</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <MaterialCommunityIcons
                                name="moon-waning-crescent"
                                size={24}
                                color="#e71a0f"
                            />
                            <Text style={styles.settingLabel}>Chế độ tối</Text>
                        </View>
                        <View style={styles.toggle}>
                            <View style={styles.toggleOff} />
                        </View>
                    </TouchableOpacity>
                </View>
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
        color: "#333",
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        color: "#333",
        marginLeft: 16,
        fontWeight: "500",
    },
    settingValue: {
        fontSize: 14,
        color: "#999",
    },
    divider: {
        height: 10,
        backgroundColor: "#f0f0f0",
    },
    settingGroup: {
        marginTop: 10,
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#999",
        paddingHorizontal: 20,
        paddingVertical: 12,
        textTransform: "uppercase",
    },
    toggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#ddd",
        justifyContent: "center",
        paddingHorizontal: 3,
    },
    toggleOff: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#fff",
    },
});

export default SettingsScreen;