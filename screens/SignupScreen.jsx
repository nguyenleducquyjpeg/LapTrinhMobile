import React, { useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Hàm kiểm tra định dạng Email bằng Regex
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSignUp = async () => {
        // 2. Kiểm tra thêm trường số điện thoại không được để trống
        if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ tất cả các trường thông tin.");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Lỗi", "Định dạng email không hợp lệ.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);

        try {
            // Tạo tài khoản trên Firebase Auth
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;

            // 3. Đẩy dữ liệu lên Firestore bao gồm cả phoneNumber
            await firestore().collection('users').doc(uid).set({
                fullName: String(fullName),
                email: String(email).toLowerCase(),
                phoneNumber: String(phoneNumber),
                password: password,
                createdAt: new Date().toISOString(),
            });

            await userCredential.user.updateProfile({
                displayName: fullName,
            });

            setLoading(false);
            Alert.alert("Thành công", "Tài khoản và số điện thoại đã được lưu!", [
                { text: "OK", onPress: () => navigation.navigate("Login") }
            ]);

        } catch (error) {
            setLoading(false);
            Alert.alert("Lỗi", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={require("../assets/cgv.png")} style={styles.logo} />
                <Text style={styles.title}> SIGN UP </Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Họ và tên</Text>
                    <TextInput
                        placeholder="Nhập họ tên"
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

                    {/* 4. Thêm ô nhập Số điện thoại vào giao diện */}
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        placeholder="Nhập số điện thoại"
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad" // Hiển thị bàn phím số
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

                <TouchableOpacity
                    style={[styles.button, loading && { backgroundColor: '#ccc' }]}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>ĐĂNG KÝ NGAY</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
    logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 5, resizeMode: 'contain' },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
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
        elevation: 5,
        height: 55, // Cố định chiều cao để không nhảy khi hiện Loading
        justifyContent: 'center'
    },
    buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 18 },
    normalText: { color: "#666", fontSize: 14, textAlign: "center", marginTop: 5 },
    linkTextCustom: { color: "#B22222", fontWeight: "bold", textDecorationLine: "underline" },
});

export default SignUpScreen;