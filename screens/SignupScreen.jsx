import React, { useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Thêm xác nhận mật khẩu

    // Hàm kiểm tra định dạng Email bằng Regex
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSignUp = () => {
        // 1. Kiểm tra trống
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ tất cả các trường thông tin.");
            return;
        }

        // 2. Kiểm tra định dạng Email
        if (!validateEmail(email)) {
            Alert.alert("Lỗi", "Định dạng email không hợp lệ (ví dụ: abc@gmail.com).");
            return;
        }

        // 3. Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        // 4. Kiểm tra mật khẩu khớp nhau
        if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
            return;
        }

        // Nếu tất cả đều đúng
        console.log("Đăng ký thành công:", { fullName, email, password });
        Alert.alert("Thành công", "Tài khoản của bạn đã được tạo!", [
            { text: "OK", onPress: () => navigation.navigate("Login") }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={require("../assets/cgv.png")} style={styles.logo} />
                <Text style={styles.title}> SIGN UP </Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Họ và tên</Text>
                    <TextInput
                        placeholder="Nhập họ tên của bạn"
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="example@gmail.com"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Mật khẩu</Text>
                    <TextInput
                        placeholder="Ít nhất 6 ký tự"
                        style={styles.input}
                        value={password}
                        secureTextEntry
                        onChangeText={setPassword}
                    />

                    <Text style={styles.label}>Xác nhận mật khẩu</Text>
                    <TextInput
                        placeholder="Nhập lại mật khẩu"
                        style={styles.input}
                        value={confirmPassword}
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>ĐĂNG KÝ NGAY</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate("Login")}
                    activeOpacity={0.7}
                >
                    <Text style={styles.normalText}>
                        Đã có tài khoản? <Text style={styles.linkTextCustom}>Đăng nhập</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 5 },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 5, marginLeft: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 15,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9"
    },
    button: {
        backgroundColor: "#B22222",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 18 },
    normalText: {
        color: "#666",
        fontSize: 14,
        textAlign: "center",
        marginTop: 5
    },
    linkTextCustom: {
        color: "#B22222",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
});

export default SignUpScreen;