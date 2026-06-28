const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },

    lastMessageText: {
        type: String,
        default: ""
    },

    lastMessageSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }

}, {
    timestamps: true
});

conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("conversation", conversationSchema);