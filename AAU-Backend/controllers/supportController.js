import { sendEmail } from "../utils/email.js";
import Message from '../models/Message.js'; 


export const sendSupportEmail = async (req, res) => {
  try {
    console.log("📩 Incoming body:", req.body);

    const { email, issue } = req.body;

    if (!email || !issue) {
      return res.status(400).json({ message: "Email and issue are required" });
    }

    
    const newMessage = new Message({
      from: email,
      subject: "New Support Request",
      message: issue,
      to: process.env.SENDER_EMAIL,
    });

    
    await newMessage.save();

   
    await sendEmail(
      "yamlaknegash96@gmail.com",
      "New Support Request",
      `From: ${email}\n\nIssue:\n${issue}`
    );
    return res.json({ email, message: "Support request sent successfully!" });
  } catch (err) {
    console.error("sendSupportEmail error:", err);
    return res.status(500).json({ message: "Failed to send support request" });
  }
};


export const sendRefinedMessage = async (req, res) => {
  try {
    const { recipient, subject, message } = req.body;

    if (!recipient || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Recipient, subject, and message are required." });
    }

   
    const refinedMessage = new Message({
      from: process.env.SENDER_EMAIL,
      subject: subject,
      message: message,
      to: recipient,
    });

 
    await refinedMessage.save();

   
    await sendEmail(recipient, subject, message);

    return res.json({ message: "Refined message sent successfully!" });
  } catch (error) {
    console.error("Error sending refined message:", error);
    return res.status(500).json({ message: "Failed to send refined message." });
  }
};


export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }); // Sort by timestamp
    return res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res.status(500).json({ message: "Failed to retrieve messages." });
  }
};

export const updateMessageReadStatus = async (req, res) => {
  const { id } = req.params;

  try {
    
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { read: true }, 
      { new: true } 
    );

    
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

 
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating message read status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};