import axios from 'axios'

export type WhatsAppAuthDetails = {
  phoneNumberId: string
  accessToken: string
}

type SendMessageResponse = {
  messaging_product: string
  contacts: {
    input: string
    wa_id: string
  }[]
  messages: {
    id: string
  }[]
}

export function isValidWhatsAppAuthDetails(authDetails: WhatsAppAuthDetails): boolean {
  return !!authDetails.phoneNumberId && !!authDetails.accessToken
}

export async function sendWhatsAppTextMessage(phoneNumberId: string, accessToken: string, recipient: string, messageContent: string) {
  try {
    const response = await axios.post<SendMessageResponse>(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: messageContent,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (response.data.messages && response.data.messages[0] && response.data.messages[0].id) {
      console.log('WhatsApp Text Message Sent:', response.data.messages[0].id)
      return response.data.messages[0].id
    } else {
      console.error('WhatsApp API Error:', response.data)
      throw new Error('WhatsApp message not sent. Check the response for details.')
    }
  } catch (error) {
    console.error('WhatsApp API Error:', error)
    throw new Error('Failed to send WhatsApp message.')
  }
}

type WhatsAppButton = {
  buttonId: string
  buttonTitle: string
}

export async function sendWhatsAppReplyButtons(
  phoneNumberId: string,
  accessToken: string,
  recipient: string,
  buttonText: string,
  buttons: WhatsAppButton[]
): Promise<string> {
  try {
    // Format the buttons based on the passed array
    const formattedButtons = buttons.map(({ buttonId, buttonTitle }) => ({
      type: 'reply',
      reply: {
        id: buttonId,
        title: buttonTitle,
      },
    }))

    const response = await axios.post<SendMessageResponse>(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: buttonText,
          },
          action: {
            buttons: formattedButtons,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (
      response.data.messages &&
      response.data.messages[0] &&
      response.data.messages[0].id
    ) {
      return response.data.messages[0].id
    } else {
      console.error('WhatsApp API Error:', response.data)
      throw new Error('WhatsApp message not sent. Check the response for details.')
    }
  } catch (error) {
    console.error('WhatsApp API Error:', error)
    throw new Error('Failed to send WhatsApp message.')
  }
}


export async function markWhatsAppMessageAsRead(phoneNumberId: string, accessToken: string, messageId: string) {
  try {
    const response = await axios.put(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages/${messageId}`,
      {
        status: 'read'
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    )

    if (response.status === 204 || (response.data && Object.keys(response.data).length === 0)) {
      console.log('WhatsApp message marked as "read".')
    } else {
      console.error('WhatsApp API Error:', response.data)
      throw new Error('Failed to mark WhatsApp message as "read".')
    }
  } catch (error) {
    console.error('WhatsApp API Error:', error)
    throw new Error('Failed to mark WhatsApp message as "read".')
  }
}

