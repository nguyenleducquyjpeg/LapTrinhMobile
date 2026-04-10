import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const WriteReviewScreen = ({ route, navigation }) => {
    const { movie } = route.params;
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    // ✅ Lấy tên từ Firestore khi component mount
    useEffect(() => {
        fetchUserName();
    }, []);

    const fetchUserName = async () => {
        try {
            const currentUser = auth().currentUser;

            if (currentUser) {
                const userDoc = await firestore()
                    .collection('users')
                    .doc(currentUser.uid)
                    .get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    // Lấy fullName từ Firestore
                    setUserName(userData.fullName || "Người dùng");
                } else {
                    // Fallback: Lấy từ displayName nếu không có trong Firestore
                    setUserName(currentUser.displayName || "Người dùng");
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Lỗi lấy tên người dùng:", error);
            setLoading(false);
        }
    };

    const handleSendReview = async () => {
        if (!comment.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập bình luận");
            return;
        }

        try {
            // Thêm review vào mảng reviews của phim
            await firestore()
                .collection("movies")
                .doc(movie.id)
                .update({
                    reviews: firestore.FieldValue.arrayUnion({
                        id: Date.now().toString(),
                        user_name: userName, // Lấy tên từ state đã fetch
                        rating: rating,
                        comment: comment,
                        date: new Date().toLocaleDateString('vi-VN'),
                    }),
                });

            Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
            navigation.goBack();
        } catch (error) {
            console.error("Lỗi gửi review:", error);
            Alert.alert("Lỗi", "Không thể gửi đánh giá");
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#b71c1c" />
                    <Text style={{ marginTop: 10 }}>Đang tải...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Viết đánh giá</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* ✅ Tên người dùng - Hiển thị từ Firestore (không cho sửa) */}
            <View style={styles.section}>
                <Text style={styles.label}>Tên của bạn</Text>
                <View style={styles.userNameDisplay}>
                    <Text style={styles.userNameText}>{userName}</Text>
                </View>
            </View>

            {/* Xếp loại */}
            <View style={styles.section}>
                <Text style={styles.label}>Xếp loại (1-5 sao)</Text>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            style={{ marginRight: 10 }}
                        >
                            <Ionicons
                                name="star"
                                size={40}
                                color={star <= rating ? "#f1c40f" : "#ddd"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.ratingText}>{rating}/5 sao</Text>
            </View>

            {/* Bình luận */}
            <View style={styles.section}>
                <Text style={styles.label}>Bình luận</Text>
                <TextInput
                    style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                    placeholder="Viết bình luận của bạn..."
                    multiline
                    value={comment}
                    onChangeText={setComment}
                    placeholderTextColor="#999"
                />
            </View>

            {/* Nút gửi */}
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendReview}>
                <Text style={styles.sendBtnText}>GỬI ĐÁNH GIÁ</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold"
    },
    section: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8
    },

    // Style cho hiển thị tên người dùng
    userNameDisplay: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    userNameText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',

    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    ratingContainer: {
        flexDirection: "row",
        marginBottom: 10
    },
    ratingText: {
        fontSize: 12,
        color: "#666"
    },
    sendBtn: {
        backgroundColor: "#b71c1c",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    sendBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },
});

export default WriteReviewScreen;