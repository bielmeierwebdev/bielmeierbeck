import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';

type ParsedAiResponse = {
  orders: {
    customerName: string;

    pickupDate: string;

    pickupTime?: string;

    items: {
      productName: string;

      quantity: number;
    }[];
  }[];

  specialOrders: {
    title: string;

    pickupDate: string;

    notes?: string;
  }[];
};

@Injectable()
export class AiService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async parseOrder(
    text: string,

    products: string[],
  ): Promise<ParsedAiResponse> {
    const today = new Date().toISOString().split('T')[0];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',

      messages: [
        {
          role: 'system',

          content: `
Du analysierst WhatsApp Nachrichten einer Bäckerei.

Die Nachrichten können enthalten:
- mehrere Kunden
- mehrere Bestellungen
- Sonderbestellungen
- Abholdaten
- Abholzeiten
- Notizen
- Dialekt
- Tippfehler

Extrahiere alle Bestellungen strukturiert.

Nutze ausschließlich Produktnamen,
die tatsächlich existieren.

Verfügbare Produkte:

${products.join('\n')}

Heute ist:
${today}

WICHTIG:

- pickupDate MUSS IMMER
  im Format YYYY-MM-DD sein

- Beispiel:
  2026-05-16

- Wenn in der Nachricht
  "Samstag" steht,
  berechne das korrekte Datum.

- Nutze ausschließlich Produkte,
  die in der Produktliste existieren.

Antwort nur als JSON.

Format:

{
  "orders": [
    {
      "customerName": "",
      "pickupDate": "",
      "pickupTime": "",
      "items": [
        {
          "productName": "",
          "quantity": 0
        }
      ]
    }
  ],

  "specialOrders": [
    {
      "title": "",
      "pickupDate": "",
      "notes": ""
    }
  ]
}
`,
        },

        {
          role: 'user',

          content: text,
        },
      ],

      response_format: {
        type: 'json_object',
      },
    });

    return JSON.parse(response.choices[0].message.content!) as ParsedAiResponse;
  }
}
