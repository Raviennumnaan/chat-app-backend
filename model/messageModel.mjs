import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

messageSchema.index({ conversation: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
