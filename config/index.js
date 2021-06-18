require('dotenv').config();

// export ข้อมูลที่ต้องการส่งออกจาก .env
module.exports = {
    // PORT: process.env.PORT,
    DOMAIN: process.env.DOMAIN,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
}