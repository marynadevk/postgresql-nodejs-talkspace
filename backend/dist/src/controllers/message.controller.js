import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db/prisma.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
class MessageController {
    async sendMessage(req, res) {
        try {
            const { message } = req.body;
            const { id: receiverId } = req.params;
            const senderId = req.user.id;
            let conversation = await prisma.conversation.findFirst({
                where: { participantsIds: { hasEvery: [senderId, receiverId] } },
            });
            if (!conversation) {
                conversation = await prisma.conversation.create({
                    data: { participantsIds: { set: [senderId, receiverId] } },
                });
            }
            const newMessage = await prisma.message.create({
                data: { senderId, body: message, conversationId: conversation.id },
            });
            if (newMessage) {
                conversation = await prisma.conversation.update({
                    where: { id: conversation.id },
                    data: { messages: { connect: { id: newMessage.id } } },
                });
            }
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }
            res.status(StatusCodes.CREATED).json(newMessage);
        }
        catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'Internal Server Error' });
        }
    }
    async getMessages(req, res) {
        try {
            const { id: userToChatId } = req.params;
            const senderId = req.user.id;
            const conversation = await prisma.conversation.findFirst({
                where: { participantsIds: { hasEvery: [senderId, userToChatId] } },
                include: { messages: { orderBy: { createdAt: 'asc' } } },
            });
            if (!conversation) {
                return res.status(StatusCodes.CREATED).json([]);
            }
            res.status(StatusCodes.OK).json(conversation.messages);
        }
        catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'Internal Server Error' });
        }
    }
    async getUsersForSidebar(req, res) {
        try {
            const authUserId = req.user.id;
            const users = await prisma.user.findMany({
                where: { id: { not: authUserId } },
                select: { id: true, fullName: true, profilePic: true },
            });
            res.status(StatusCodes.CREATED).json(users);
        }
        catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'Internal Server Error' });
        }
    }
}
export const messageController = new MessageController();
