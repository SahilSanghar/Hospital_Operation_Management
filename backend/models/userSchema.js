import { db } from '../database/firebase.js';
import bcrypt from 'bcrypt';

class User {
    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.nic = data.nic;
        this.dob = data.dob;
        this.gender = data.gender;
        this.password = data.password;
        this.role = data.role;
        this.doctorDepartment = data.doctorDepartment;
        this.docAvatar = data.docAvatar;
    }

    async save() {
        try {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            const userData = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                phone: this.phone,
                nic: this.nic,
                dob: this.dob,
                gender: this.gender,
                password: hashedPassword,
                role: this.role,
                // Only include doctorDepartment and docAvatar if they are defined
                ...(this.role === 'Doctor' && this.doctorDepartment && { doctorDepartment: this.doctorDepartment }),
                ...(this.role === 'Doctor' && this.docAvatar && { docAvatar: this.docAvatar }),
            };
            const userRef = await db.collection('users').add(userData);
            return userRef.id;
        } catch (error) {
            throw new Error('Error adding user: ' + error.message);
        }
    }

    async generateAuthToken() {
        const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES,
        });
        return token;
    }

    // async comparePassword(candidatePassword) {
    //     return bcrypt.compare(candidatePassword, this.password);
    // }

    static async findByEmail(email) {
        const userRef = db.collection('users');
        const querySnapshot = await userRef.where('email', '==', email).get();
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    }

    static async findById(id) {
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    }

    static async findByRole(role) {
        const userRef = db.collection('users');
        const querySnapshot = await userRef.where('role', '==', role).get();
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    }

    static async getAll() {
        try {
            const snapshot = await db.collection('users').get();
            const users = [];
            snapshot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() });
            });
            return users;
        } catch (error) {
            throw new Error('Error getting users: ' + error.message);
        }
    }
}

export default User;
