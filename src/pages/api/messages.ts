import { NextApiRequest, NextApiResponse } from 'next';
   import { Message } from '../../../secura-chat/src/models/Message';
   import '../../lib/db';

   export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     if (req.method === 'POST') {
       try {
         const { senderId, receiverId, content } = req.body;
         const message = new Message({ sender: senderId, receiver: receiverId, content });
         await message.save();
         res.status(201).json(message);
       } catch (error) {
         res.status(500).json({ message: 'Error sending message', error });
       }
     } else if (req.method === 'GET') {
       try {
         const { userId1, userId2 } = req.query;
         const messages = await Message.find({
           $or: [
             { sender: userId1, receiver: userId2 },
             { sender: userId2, receiver: userId1 }
           ]
         }).sort('timestamp');
         res.json(messages);
       } catch (error) {
         res.status(500).json({ message: 'Error fetching messages', error });
       }
     } else {
       res.setHeader('Allow', ['GET', 'POST']);
       res.status(405).end(`Method ${req.method} Not Allowed`);
     }
   }