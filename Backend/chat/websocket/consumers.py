from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio
import uuid
import datetime
from urllib.parse import parse_qs
import httpx  # ✅ For async HTTP requests
import google.generativeai as genai
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken

from chat.websocket.services import (
    get_chat_if_user_matches,
    get_previous_messages,
    create_message,
    update_message_response,
    get_user,
    get_user_data
)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.user = await self.authenticate_user()

        if not self.user or isinstance(self.user, AnonymousUser):
            print("WebSocket Connection Rejected: Unauthenticated user")
            await self.close(code=4001)  # Custom close code for authentication failure
            return

        self.chat = await get_chat_if_user_matches(self.chat_id, self.user)

        if not self.chat:
            print("WebSocket Connection Rejected: Invalid chat or unauthorized user")
            await self.close(code=4003)  # Custom close code for unauthorized access
            return

        await self.accept()

        await self.send(json.dumps({
            "type": "connection_established",
            "chat_id": self.chat_id
        }))

        previous_messages = await get_previous_messages(self.chat_id)
        if previous_messages:
            await self.send(json.dumps({
                "type": "previous_messages",
                "messages": previous_messages,
            }))

    async def disconnect(self, code):
        print(f"WebSocket disconnected with code: {code}")
        pass

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            user_message = data.get("content", "")

            if not user_message:
                await self.send(json.dumps({
                    "type": "error",
                    "message": "Message content cannot be empty"
                }))
                return

            # Create the user message
            message = await create_message(self.chat_id, self.user, user_message)

            # Notify user message sent
            await self.send(json.dumps({
                "type": "message",
                "message": {
                    "id": str(message.id),
                    "content": user_message,
                    "role": "user",
                    "timestamp": message.timestamp.isoformat(),
                    "chatId": self.chat_id
                }
            }))

            # Prepare assistant message
            response_text = ""
            assistant_message_id = str(uuid.uuid4())

            await self.send(json.dumps({
                "type": "message",
                "message": {
                    "id": assistant_message_id,
                    "content": "",
                    "role": "assistant",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "chatId": self.chat_id
                }
            }))

            user_data = await get_user_data(self.user)
            previous_messages = await get_previous_messages(self.chat_id)

            async for chunk in call_retrieve_api(previous_messages, user_message, user_data):
                response_text += chunk
                await self.send(json.dumps({
                    "type": "message_update",
                    "message_id": assistant_message_id,
                    "content": response_text,
                }))

            # Update the response on the original message (or create a new one if needed)
            await update_message_response(message, response_text)

            # Final response confirmation
            await self.send(json.dumps({
                "type": "message",
                "message": {
                    "id": assistant_message_id,
                    "content": response_text,
                    "role": "assistant",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "chatId": self.chat_id
                }
            }))

        except json.JSONDecodeError:
            await self.send(json.dumps({
                "type": "error",
                "message": "Invalid JSON format"
            }))
        except Exception as e:
            print(f"Error in receive: {str(e)}")
            await self.send(json.dumps({
                "type": "error",
                "message": f"An error occurred: {str(e)}"
            }))

    async def authenticate_user(self):
        query_params = parse_qs(self.scope["query_string"].decode())
        token = query_params.get("token", [None])[0]

        if not token:
            print("No token provided in query parameters")
            return AnonymousUser()

        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            user = await get_user(user_id)
            if not user:
                print(f"User with ID {user_id} not found")
                return AnonymousUser()
            return user
        except Exception as e:
            print(f"Token authentication error: {str(e)}")
            return AnonymousUser()


# async def stream_gemini_response(user_message):
#     model = genai.GenerativeModel("gemini-1.5-flash")
#     response = model.generate_content(user_message, stream=True)
#     for chunk in await asyncio.to_thread(list, response):
#         yield chunk.text


async def call_retrieve_api(previous_messages, user_message, user_data):
    url = "https://arpit-bansal-healthbridge.hf.space/retrieve"
    payload = {
        "previous_state": previous_messages,
        "query": user_message,
        "user_data": user_data
    }

    print("Final Payload Sent:", json.dumps(payload, indent=2))
    headers = {"Content-Type": "application/json"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response_data = response.json()
            result = response_data.get("response", "")

            # ✅ Yield the response like a stream
            for chunk in result.split():  # simulate streaming chunk-by-chunk
                yield chunk + " "  # preserve spacing
    except httpx.RequestError as e:
        print(f"Error calling AI retrieval API: {e}")
        yield "I'm facing technical issues. Please try again later."
