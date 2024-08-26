import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Message } from '../../models/Message';
import { User } from '../../models/User';
import { dbConnect } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the session to authenticate the user
  const session = await getSession({ req });
  
  // Check if the user is authenticated
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Connect to the database
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Fetch the last messages where the user is either the sender or receiver
      const lastMessages = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: session.user.id }, { receiver: session.user.id }]
          }
        },
        {
          $sort: { timestamp: -1 }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ['$sender', session.user.id] },
                '$receiver',
                '$sender'
              ]
            },
            lastMessage: { $first: '$content' },
            timestamp: { $first: '$timestamp' }
          }
        }
      ]);

      // Fetch the user details for each conversation
      const conversations = await Promise.all(
        lastMessages.map(async (msg) => {
          const contact = await User.findById(msg._id).select('name');
          return {
            id: msg._id,
            contactName: contact.name,
            lastMessage: msg.lastMessage,
            timestamp: msg.timestamp
          };
        })
      );

      // Return the conversations
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching conversations' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
