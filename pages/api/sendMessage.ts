import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export default function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
  const token = <string>process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, token);
  const { phone, location } = req.body;
  // console.log(phone, message);
  client.messages
    .create({
      body: 'EmberAlert: Thank you for opting in to receive alerts about wildfires in your area! Std Msg & data rates may apply. Reply HELP for help, STOP to cancel.',
      from: '+16418475449',
      to: phone,
    })
    .then((message) =>
      res.json({
        success: true,
      })
    )
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
      });
    });
}
