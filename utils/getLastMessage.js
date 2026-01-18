import MessageModel from "../models/message-model.js";

/**
 * Get a summary of messages for friends:
 * - friendId
 * - count of unseen messages
 * - latest message (text or image)
 * - senderId of the latest message
 */
export const getLastMessage = async (friends, userId) => {
  const summary = [];

  await Promise.all(
    friends.map(async (friend) => {
      // Get the latest message between this friend and the user
      const lastMessageDoc = await MessageModel.findOne({
        $or: [
          { senderId: friend._id, receiverId: userId },
          { senderId: userId, receiverId: friend._id },
        ],
      })
        .sort({ createdAt: -1 })
        .select("text image senderId seen")
        .lean();

      // Format lastMessage for UI
      let lastMessage = null;
      if (lastMessageDoc) {
        if (lastMessageDoc.text) {
          lastMessage = lastMessageDoc.text;
        } else if (lastMessageDoc.image) {
          lastMessage = "sent a photo"; // placeholder for UI
        }
      }

      summary.push({
        lastMessage,
        friendId: friend?._id,
        lastMessageSenderId: lastMessageDoc ? lastMessageDoc.senderId : null,
      });
    })
  );

  return summary;
};
