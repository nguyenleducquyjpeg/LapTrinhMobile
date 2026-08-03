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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Địa chỉ API Backend Node.js kết nối PostgreSQL
const API_LOGIN_POSTGRES = "http://10.0.2.2:3000/api/users/login";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Email và Mật khẩu.");
            return;
        }

        setLoading(true);

        try {
            // =========================================================
            // 1. ĐĂNG NHẬP FIREBASE AUTH & LẤY DỮ LIỆU TỪ FIRESTORE
            // =========================================================
            const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
            const uid = userCredential.user.uid;

            // Đọc thông tin người dùng từ Firestore
            const userDoc = await firestore().collection('users').doc(uid).get();
            const firestoreData = userDoc.exists ? userDoc.data() : null;

            console.log("1. Đăng nhập Firebase Auth & Firestore thành công!");

            // =========================================================
            // 2. LẤY THÔNG TIN PII ĐÃ GIẢI MÃ TỪ POSTGRESQL BACKEND
            // =========================================================
            let pgUserData = null;
            try {
                const response = await fetch(API_LOGIN_POSTGRES, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        password: password,
                    }),
                });

                const rawText = await response.text();
                if (response.ok) {
                    const pgJson = JSON.parse(rawText);
                    pgUserData = pgJson.user;
                    console.log("2. Giải mã PII từ PostgreSQL thành công!", pgUserData);
                } else {
                    console.warn("PostgreSQL cảnh báo:", rawText);
                }
            } catch (pgErr) {
                console.warn("Không thể kết nối PostgreSQL Backend:", pgErr.message);
            }

            setLoading(false);

            // =========================================================
            // 3. CHUYỂN SANG HOMESCREEN (KÈM DỮ LIỆU FIRESTORE & POSTGRES)
            // =========================================================
            navigation.navigate("Home", {
                user: {
                    uid: uid,
                    email: email.trim(),
                    firestoreInfo: firestoreData,
                    pgInfo: pgUserData
                }
            });

        } catch (error) {
            setLoading(false);

            // Xử lý các mã lỗi của Firebase Auth
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                Alert.alert("Thất bại", "Email hoặc mật khẩu không chính xác.");
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert("Lỗi", "Định dạng email không hợp lệ.");
            } else {
                Alert.alert("Lỗi Đăng Nhập", error.message);
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
                <Text style={[styles.title, { textAlign: 'center' }]}>LOGIN</Text>

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
        marginBottom: 15
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