// models/messageSchema.js
import { db } from "../database/firebase.js";
import { validateMessage } from "../validator/validateMessage.js"

class Message {
    constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.message = data.message;
    }

static async getAll() {
    try {
        const snapshot = await db.collection("messages").get();
        const messages = [];
        snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
        });
        return messages;
    } catch (error) {
        throw new Error("Error getting messages: " + error.message);
    }
    }

static async create(data) {
    const { isValid, errors } = validateMessage(data);

    if (!isValid) {
        throw new Error(JSON.stringify(errors));
    }

    try {
        const messageRef = await db.collection("messages").add(data);
        return messageRef.id;
    } catch (error) {
        throw new Error("Error adding message: " + error.message);
    }
    }
}

export default Message;
