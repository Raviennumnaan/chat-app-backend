import mongoose, { Schema } from 'mongoose';

const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],

  createdAt: { type: Date, default: Date.now() },

  lastMessage: { type: Date, default: Date.now() },
});

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
