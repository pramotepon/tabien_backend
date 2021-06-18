const config = require('../config/index');
const User = require('../models/userModel');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
// ดึง token ที่ client ส่งมาเก็บไว้ที่ jwtFromRequest
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// ใส่ SECRET KEY ของเว็บเรา
opts.secretOrKey = config.JWT_SECRET;
// ข้อมูลที่ใส่รหัสไว้จะถูกส่งมาใน jwt_payload
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    // get the decoded payload and header
    // console.log(config.JWT_SECRET);
    // console.log(jwt_payload);
    try {
        // เรียกดูข้อมูล staff จาก _id ที่ถูกถอดรหัสแล้ว
        const user = await User.findById(jwt_payload.id);
        if(!user){
            return done(new Error('ไม่พบผู้ใช้ในระบบ'), null);
        }

        return done(null, user);
    } catch (error) {
        done(error);
    }
}));
// ฟังก์ชั่นสำหรับกัน Route ที่เราต้องการให้ login ก่อนเข้า
module.exports.isLogin = passport.authenticate('jwt', { session: false });