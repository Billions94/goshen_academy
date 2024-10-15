import fs from 'fs';
import path from 'path';
import { CartPurchase } from '../../cart/service/interface';

const templatePath = path.join(
  __dirname,
  '..',
  'template',
  'email.template.html'
);

if (!fs.existsSync(templatePath)) {
  throw new Error(`Email template file not found at ${templatePath}`);
}

// Read the email template file and replace placeholders with actual data.
const template = fs.readFileSync(templatePath, 'utf8');

export const generateEmailContent = (purchaseDetails: CartPurchase) => {
  let emailContent = template;

  emailContent = emailContent.replace(
    '{{email}}',
    purchaseDetails.email || 'Valued Customer'
  );
  emailContent = emailContent.replace(
    '{{totalCost}}',
    `$${purchaseDetails.totalCost.toFixed(2)}`
  );
  emailContent = emailContent.replace(
    '{{paymentMethod}}',
    purchaseDetails.paymentMethod
  );
  emailContent = emailContent.replace('{{status}}', purchaseDetails.status);

  const itemsList = purchaseDetails.items
    .map(
      (item) => `
    <tr>
      <th>${item.product.name}</th>
      <td>$${item.price.toFixed(2)} x ${item.quantity}</td>
    </tr>
  `
    )
    .join('');

  emailContent = emailContent.replace('{{items}}', itemsList);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  emailContent = emailContent.replace('{{current-date}}', formattedDate);

  return emailContent;
};
