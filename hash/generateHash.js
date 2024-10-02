import bcrypt from 'bcryptjs';

const password = '1150pp';
const saltRounds = 10; // ระดับของการสร้าง salt

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Hash ของรหัสผ่าน:', hash);
    }
});
