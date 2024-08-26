import { NextApiRequest, NextApiResponse } from 'next';
   import { User } from '../../models/User';
   import '../../../../src/lib/db'; // This will ensure the database connection is established

   export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     if (req.method === 'POST') {
       try {
         const { name, email } = req.body;
         const user = new User({ name, email });
         await user.save();
         res.status(201).json(user);
       } catch (error) {
         res.status(500).json({ message: 'Error registering user', error });
       }
     } else {
       res.setHeader('Allow', ['POST']);
       res.status(405).end(`Method ${req.method} Not Allowed`);
     }
   }