import Conversation from '../model/conversationModel.mjs';
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

export const createConversation = catchAsync(async function (req, res, next) {
  const { participants } = req.body;

  if (!participants)
    return next(new AppError('Participants array is required', 400));

  if (!Array.isArray(participants) || participants.length === 0)
    return next(new AppError('Participants must be a non-empty array', 400));

  participants.push(req.user.id);

  const existingConversation = await Conversation.findOne({
    participants: { $all: participants },
  });

  if (existingConversation) {
    return res
      .status(200)
      .json({ status: 'success', data: existingConversation });
  }

  const newConversation = await Conversation.create({
    participants: participants,
  });

  res.status(201).json({ status: 'success', data: newConversation });
});

export const getAllConversations = catchAsync(async function (req, res, next) {
  const conversations = await Conversation.find({
    participants: req.user.id,
  })
    .populate('participants')
    .sort({ lastMessage: -1 });

  res.status(200).json({
    status: 'success',
    results: conversations.length,
    data: conversations,
  });
});
