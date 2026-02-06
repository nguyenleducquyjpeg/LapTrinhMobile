import React from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form"; // Import thêm Controller
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Định nghĩa Schema (Giữ nguyên logic của bạn)
const signupSchema = z.object({
    fullName: z.string().min(1, "Họ tên không được để trống"),
    phoneNumber: z.string().regex(/^[0-9]+$/, "Số điện thoại chỉ chứa số").min(10, "Tối thiểu 10 số"),
    email: z.string().email("Email không hợp lệ"),
    username: z.string().min(3, "Username tối thiểu 3 ký tự"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

const SignUpScreen = ({ navigation }) => {
    // 2. Khởi tạo React Hook Form
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: "", phoneNumber: "", email: "", username: "", password: "", confirmPassword: ""
        }
    });

    const onSubmit = (data) => {
        console.log("Đăng ký thành công:", data);
        navigation.navigate("Home");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={require("../assets/cgv.png")} style={styles.logo} />
                <Text style={styles.title}>Sign Up</Text>

                {/* Ví dụ mẫu cho 1 trường Input dùng Controller */}
                <Text style={styles.label}>Họ và tên</Text>
                <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.fullName && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Nhập họ tên"
                        />
                    )}
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

                {/* Số điện thoại */}
                <Text style={styles.label}>Số điện thoại</Text>
                <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.phoneNumber && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Nhập số điện thoại"
                            keyboardType="numeric"
                        />
                    )}
                />
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}

                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="example@gmail.com"
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                {/* Mật khẩu */}
                <Text style={styles.label}>Mật khẩu</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.password && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Tối thiểu 6 ký tự"
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                {/* Xác nhận mật khẩu */}
                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.confirmPassword && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Nhập lại mật khẩu"
                            secureTextEntry
                        />
                    )}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

                <TouchableOpacity
                    style={styles.signUpBtn}
                    onPress={handleSubmit(onSubmit)} // Dùng handleSubmit của thư viện
                >
                    <Text style={styles.signUpBtnText}>ĐĂNG KÝ</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    logo: { width: 64, height: 64, alignSelf: "center", marginBottom: 10 },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: { borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 8, marginBottom: 5 },
    inputError: { borderBottomColor: "red" },
    errorText: { color: "red", fontSize: 12, marginBottom: 10 },
    signUpBtn: { backgroundColor: "#B22222", padding: 15, borderRadius: 8, marginTop: 20 },
    signUpBtnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
    link: { color: "#B71C1C", textAlign: "center", marginTop: 20, fontWeight: "bold" }
});

export default SignUpScreen;