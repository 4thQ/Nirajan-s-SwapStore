import nodemailer from "nodemailer";
import config from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: false,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASSWORD,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: 'SwapStore 😊❤🚀👻" <store@swapstore.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log("Error while sending mail");
    console.log(error);
  }
};

export default sendMail;

export const generateOrderEmailHtml = (order, owner) => {
  const orderLink = `${config.WEBSITE_DOMAIN}/dashboard/my-orders`;

  // Conditional content based on order type
  const swapDetails =
    order.type === "swap"
      ? `
    <li><strong>Swap With:</strong> ${order.swapWith}</li>
  `
      : "";

  const rentDetails =
    order.type === "rent"
      ? `
    <li><strong>Per Day Rent:</strong> ${order.perDayRent}</li>
    <li><strong>Number of Days:</strong> ${order.numberOfDays}</li>
  `
      : "";

  return `
    <html>
      <body>
        <h1>New Order Placed</h1>
        <p>Dear ${owner.firstName} ${owner.lastName},</p>
        <p>You have a new order!</p>
        <p>Order details are as follows:</p>
        <ul>
          <li><strong>Order Type:</strong> ${order.type}</li>
          <li><strong>Item:</strong> ${order.itemName}</li>
          ${swapDetails}
          ${rentDetails}
          <li><strong>Amount:</strong> $${order.amount}</li>
          <li><strong>Address:</strong> ${order.address}</li>
          <li><strong>Phone Number:</strong> ${order.phoneNumber}</li>
        </ul>
        <p>To view the order details, please click the link below:</p>
        <a href="${orderLink}">View Order</a>
        <p>Thank you!</p>
      </body>
    </html>
  `;
};
