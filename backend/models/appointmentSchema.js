import { db } from "../database/firebase.js";
import { validateAppointment } from "../validator/validateAppointment.js";

class Appointment {
    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.nic = data.nic;
        this.dob = data.dob;
        this.gender = data.gender;
        this.appointment_date = data.appointment_date;
        this.department = data.department;
        this.doctor = data.doctor;
        this.hasVisited = data.hasVisited || false;
        this.address = data.address;
        this.doctorId = data.doctorId;
        this.patientId = data.patientId;
        this.status = data.status || 'Pending';
    }

    static async getAll() {
        try {
            const snapshot = await db.collection("appointments").get();
            const appointments = [];
            snapshot.forEach((doc) => {
                appointments.push({ id: doc.id, ...doc.data() });
            });
            return appointments;
        } catch (error) {
            throw new Error("Error getting appointments: " + error.message);
        }
    }
    
    static async find(query) {
        try {
        let userRef = db.collection("users");
        if (query.firstName) {
            userRef = userRef.where("firstName", "==", query.firstName);
        }
        if (query.lastName) {
            userRef = userRef.where("lastName", "==", query.lastName);
        }
        if (query.role) {
            userRef = userRef.where("role", "==", query.role);
        }
        if (query.doctorDepartment) {
            userRef = userRef.where("doctorDepartment", "==", query.doctorDepartment);
        }
        
        const snapshot = await userRef.get();
        const users = [];
        snapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
        } catch (error) {
            throw new Error("Error finding users: " + error.message);
        }
    }

    static async getById(id) {
        try {
            const doc = await db.collection("appointments").doc(id).get();
            if (!doc.exists) {
                throw new Error("Appointment not found");
            }
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw new Error("Error getting appointment: " + error.message);
        }
    }

    static async create(data) {
        const { isValid, errors } = validateAppointment(data);

        if (!isValid) {
            throw new Error(JSON.stringify(errors));
        }

        try {
            const appointmentRef = await db.collection("appointments").add(data);
            return appointmentRef.id;
        } catch (error) {
            throw new Error("Error adding appointment: " + error.message);
        }
    }

    static async update(id, data) {
        // const { isValid, errors } = validateAppointment(data);

        // if (!isValid) {
        //     throw new Error(JSON.stringify(errors));
        // }

        try {
            await db.collection("appointments").doc(id).update(data);
        } catch (error) {
            throw new Error("Error updating appointment: " + error.message);
        }
    }

    static async delete(id) {
        try {
            await db.collection("appointments").doc(id).delete();
        } catch (error) {
            throw new Error("Error deleting appointment: " + error.message);
        }
    }
}

export default Appointment;
