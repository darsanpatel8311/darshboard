const WORDPRESS_ENDPOINT = 'https://darshboard.com/wp-json/darshboard-chat/v1/message';
const isLocalDevelopment = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const DEFAULT_ENDPOINT = isLocalDevelopment ? WORDPRESS_ENDPOINT : '/wp-json/darshboard-chat/v1/message';

const getEndpoint = () => process.env.REACT_APP_CHATBOT_API_URL || DEFAULT_ENDPOINT;

export const sendChatbotMessage = async ({ message, history }) => {
  let response;

  try {
    response = await fetch(getEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
  } catch (error) {
    throw new Error('Unable to reach the WordPress chat service. Check the endpoint URL and your connection.');
  }

  const responseText = await response.text();
  let payload;

  try {
    payload = JSON.parse(responseText);
  } catch (error) {
    throw new Error(
      'The WordPress chat service did not return JSON. Verify that the chatbot plugin is installed and active.'
    );
  }

  if (!response.ok) {
    if (payload?.code === 'rest_no_route') {
      throw new Error('The WordPress chatbot route was not found. Install and activate the Darshboard Chatbot Endpoint plugin.');
    }

    throw new Error(payload?.message || 'The WordPress chat service is unavailable right now.');
  }

  if (!payload?.success || !payload?.data?.answer) {
    throw new Error(payload?.message || 'The WordPress chat service returned an unexpected response.');
  }

  return payload.data;
};
