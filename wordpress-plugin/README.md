# Darshboard Chatbot Endpoint

This WordPress plugin provides the free, predefined-response backend for the React chatbot. It does not use an API key, an AI provider, or any external service.

## Install

1. Create `wp-content/plugins/darshboard-chatbot-endpoint/` on the WordPress server.
2. Upload `darshboard-chatbot-endpoint.php` to that directory.
3. Activate **Darshboard Chatbot Endpoint** in **Plugins**.
4. Verify the route with this request (it should return a JSON object with `success: true`):

```bash
curl -X POST https://your-domain.com/wp-json/darshboard-chat/v1/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Services","history":[]}'
```

The React app sends `POST` requests to `/wp-json/darshboard-chat/v1/message` with a `message` and the latest conversation `history`.

For local React development, set `REACT_APP_CHATBOT_API_URL` in `.env` to your WordPress site's full endpoint URL, then restart `npm start`.

## Customize replies

Edit the `$knowledge_base` array in `Darshboard_Predefined_Chatbot_Provider`. Each item has `keywords` and an `answer`.

## Future provider

The endpoint uses `Darshboard_Chatbot_Response_Provider`. A future provider can implement that interface and replace the predefined one through the `darshboard_chatbot_response_provider` filter. The React UI and request format remain unchanged.
