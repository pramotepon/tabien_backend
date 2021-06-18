// สร้างฟังก์ชั่น เพื่อรับ error โดยมี parameter err เพื่อรอรับ error ที่ถูกส่งมา
module.exports = (err, req, res, next) => {
    // กำหนด statusCode ให้เท่ากับค่าที่ส่งมาหรือ 500
    const statusCode = err.statusCode || 500;
    // คืนค่า Error กลับไปแสดงผล
    return res.status(statusCode).json({
        error: {
            status_code : statusCode,
            message: err.message,
            validation: err.validation
        }
    });
}