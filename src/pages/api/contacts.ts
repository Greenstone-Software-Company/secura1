import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '../../../secura-chat/src/models/User';
import dbConnect from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const contacts = await User.find({ _id: { $ne: session.user.id } }).select('name email');
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching contacts' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}