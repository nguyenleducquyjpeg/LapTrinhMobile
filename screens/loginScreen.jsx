import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// 1. Import Firebase Auth
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
    // 2. Khai báo State để lưu thông tin nhập liệu
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // 3. Hàm xử lý đăng nhập thực tế
    const handleLogin = async () => {
        // Kiểm tra đầu vào cơ bản
        if (!email.trim() || !password) {
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Email và Mật khẩu.");
            return;
        }

        setLoading(true); // Hiện icon load

        try {
            // Gọi hàm đăng nhập của Firebase
            await auth().signInWithEmailAndPassword(email.trim(), password);

            setLoading(false);
            console.log("Đăng nhập thành công!");
            navigation.navigate("Home"); // Chuyển vào trang chủ
        } catch (error) {
            setLoading(false);

            // Xử lý các mã lỗi phổ biến
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                Alert.alert("Thất bại", "Email hoặc mật khẩu không chính xác.");
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert("Lỗi", "Định dạng email không hợp lệ.");
            } else {
                Alert.alert("Lỗi", "Có lỗi xảy ra: " + error.message);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.View}>
                <Image
                    source={require("../assets/cgv.png")}
                    style={styles.Image}
                />
                <Text style={[styles.title, { textAlign: 'center' }]}>ĐĂNG NHẬP</Text>

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Mật khẩu"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    style={[styles.loginButton, loading && { backgroundColor: '#ccc' }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    Bằng việc đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    View: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20
    },
    container: {
        padding: 16,
        flex: 1
    },
    Image: {
        width: 120,
        height: 120,
        marginBottom: 10,
        alignSelf: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#DFDFDF",
        marginBottom: 16,
        paddingBottom: 8
    },
    loginButton: {
        backgroundColor: "#dc383e",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    },
    footerText: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginTop: 16
    },
    link: {
        color: "#dc383e",
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 8
    },
});

export default LoginScreen;