import firestore from '@react-native-firebase/firestore';

export const uploadScreeningsToFirestore = async () => {
    try {
        const batch = firestore().batch();

        // Dữ liệu suất chiếu mẫu
        const screenings = [
            {
                id: "screening_1",
                theater_id: "theater_1",
                theater_name: "Gigamall Thủ Đức",
                movie_id: "1", // ID phim từ movies collection
                movie_name: "Avatar",
                screening_time: new Date(2026, 3, 15, 14, 30).toISOString(),
                format: "2D Phụ đề",
                seats: generateDefaultSeats(),
            },
            {
                id: "screening_2",
                theater_id: "theater_1",
                theater_name: "Gigamall Thủ Đức",
                movie_id: "1",
                movie_name: "Avatar",
                screening_time: new Date(2026, 3, 15, 18, 45).toISOString(),
                format: "2D Phụ đề",
                seats: generateDefaultSeats(),
            },
            {
                id: "screening_3",
                theater_id: "theater_1",
                theater_name: "Gigamall Thủ Đức",
                movie_id: "1",
                movie_name: "Avatar",
                screening_time: new Date(2026, 3, 15, 22, 30).toISOString(),
                format: "2D Phụ đề",
                seats: generateDefaultSeats(),
            },
            {
                id: "screening_4",
                theater_id: "theater_2",
                theater_name: "Vincom Quảng Ngãi",
                movie_id: "1",
                movie_name: "Avatar",
                screening_time: new Date(2026, 3, 15, 10, 0).toISOString(),
                format: "2D Phụ đề",
                seats: generateDefaultSeats(),
            },
            {
                id: "screening_5",
                theater_id: "theater_2",
                theater_name: "Vincom Quảng Ngãi",
                movie_id: "1",
                movie_name: "Avatar",
                screening_time: new Date(2026, 3, 15, 15, 30).toISOString(),
                format: "2D Phụ đề",
                seats: generateDefaultSeats(),
            },
            {
                id: "screening_6",
                theater_id: "theater_3",
                theater_name: "Vincom Center Landmark 81",
                movie_id: "1",
                movie_name: "Avatar",
                screening_time: new Date(2026, 3, 15, 9, 30).toISOString(),
                format: "2D Phụ đề",
                seats: generateDefaultSeats(),
            },
            {
                id: "screening_7",
                theater_id: "theater_3",
                theater_name: "Vincom Center Landmark 81",
                movie_id: "1",
                movie_name: "Avatar",
                screening_time: new Date(2026, 3, 15, 20, 0).toISOString(),
                format: "2D Phụ đề",
                seats: generateDefaultSeats(),
            },
        ];

        // Thêm vào batch
        screenings.forEach((screening) => {
            const docRef = firestore().collection('screenings').doc(screening.id);
            batch.set(docRef, screening);
        });

        await batch.commit();
        console.log("✅ Suất chiếu đã được upload thành công!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi upload suất chiếu:", error);
        throw error;
    }
};

// Hàm tạo ghế mặc định (8 cột x 10 hàng)
export const generateDefaultSeats = () => {
    const seats = [];
    const rows = 10;
    const cols = 8;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const rowLetter = String.fromCharCode(65 + i); // A, B, C, ...
            const seatNumber = j + 1;
            seats.push({
                seat_location: `${rowLetter}${seatNumber}`,
                status: true, // true = trống
            });
        }
    }

    return seats;
};