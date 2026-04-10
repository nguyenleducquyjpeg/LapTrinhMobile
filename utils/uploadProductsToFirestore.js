import firestore from '@react-native-firebase/firestore';

// Dữ liệu các sản phẩm bắp nước
const PRODUCTS = [
    {
        id: "1",
        name: "SNOOPY SPORT 2025 SINGLE",
        price: 249000,
        description: "01 Ly nước Snoopy Sport 2025 (không kèm nước)\n01 Coca-cola 32oz\n01 Bắp ngọt lớn 44oz ...",
        image: "https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2025/102025/2025_Snoopy_N_O_350x495.png",
        category: "combo",
        available: true,
        createdAt: new Date(),
    },
    {
        id: "2",
        name: "PREMIUM MY COMBO",
        price: 115000,
        description: "1 Bắp Ngọt Lớn + 1 Nước Siêu Lớn + 1 Snack\n- Áp dụng giá Lễ, Tết cho các sản phẩm bắp nước đối với suất chiếu vào ngày Lễ, Tết ...",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ3mllEoRlqtmBynDL9Kp5Bgr21KehO1EJsoy2v8Bn8g&s",
        category: "combo",
        available: true,
        createdAt: new Date(),
    },
    {
        id: "3",
        name: "MY COMBO",
        price: 95000,
        description: "1 Bắp Ngọt Lớn + 1 Nước Siêu Lớn\n- Áp dụng giá Lễ, Tết cho các sản phẩm bắp nước đối với suất chiếu vào ngày Lễ, Tết ...",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXa3xBL9AlE3BE3D8gTyRzq_eof7Qv8ncCOqgTV7hIfQ&s",
        category: "combo",
        available: true,
        createdAt: new Date(),
    },
    {
        id: "4",
        name: "KHÔ GÀ CAO BẰNG",
        price: 120000,
        description: "Khô gà xé sợi Cao Bằng vị truyền thống đặc trưng, đậm đà, thơm ngon, giòn dai, ăn là ghiền ...",
        image: "https://via.placeholder.com/150",
        category: "snack",
        available: true,
        createdAt: new Date(),
    },
];

// Hàm đẩy dữ liệu sản phẩm lên Firestore
// Chạy lần đầu tiên để khởi tạo dữ liệu

export const uploadProductsToFirestore = async () => {
    try {
        console.log("📤 Đang đẩy dữ liệu sản phẩm lên Firestore...");

        const batch = firestore().batch();

        PRODUCTS.forEach((product) => {
            const docRef = firestore()
                .collection('products')
                .doc(product.id);

            batch.set(docRef, {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                category: product.category,
                available: product.available,
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        });

        await batch.commit();
        console.log("✅ Dữ liệu sản phẩm đã lên Firestore thành công!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi đẩy dữ liệu sản phẩm:", error);
        alert("Lỗi: " + error.message);
        return false;
    }
};

// Hàm lấy tất cả sản phẩm từ Firestore

export const getProductsFromFirestore = (callback) => {
    try {
        const unsubscribe = firestore()
            .collection('products')
            .onSnapshot(
                (snapshot) => {
                    const productList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log("📥 Lấy dữ liệu sản phẩm từ Firestore:", productList);
                    callback(productList);
                },
                (error) => {
                    console.error('❌ Lỗi lấy dữ liệu sản phẩm:', error);
                }
            );

        return unsubscribe;
    } catch (error) {
        console.error("❌ Lỗi kết nối Firestore:", error);
    }
};

// Hàm lấy sản phẩm theo danh mục

export const getProductsByCategory = (category, callback) => {
    try {
        const unsubscribe = firestore()
            .collection('products')
            .where('category', '==', category)
            .onSnapshot(
                (snapshot) => {
                    const productList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    callback(productList);
                },
                (error) => {
                    console.error(`❌ Lỗi lấy sản phẩm theo danh mục ${category}:`, error);
                }
            );

        return unsubscribe;
    } catch (error) {
        console.error("❌ Lỗi:", error);
    }
};