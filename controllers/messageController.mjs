import Conversation from '../model/conversationModel.mjs';
import Message from '../model/messageModel.mjs';
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

export const createMessage = catchAsync(async function (req, res, next) {
  const { content } = req.body;

  if (!content) return next(new AppError('Content is required', 400));

  const message = await Message.create({
    sender: req.user.id,
    conversation: req.params.id,
    content,
  });

  await Conversation.findByIdAndUpdate(req.params.id, {
    lastMessage: Date.now(),
  });

  res.status(201).json({ status: 'success', data: message });
});

export const getConversationMessages = catchAsync(async function (
  req,
  res,
  next
) {
  const messages = await Message.find({ conversation: req.params.id }).sort({
    timestamp: 1,
  });

  res
    .status(200)
    .json({ status: 'success', results: messages.length, data: messages });
});
