from django.contrib.auth import get_user_model
from chat.models import Chat, Message
from channels.db import database_sync_to_async

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


@database_sync_to_async
def get_chat_if_user_matches(chat_id, user):
    try:
        chat = Chat.objects.get(id=chat_id)
        if chat.user == user:
            return chat
    except Chat.DoesNotExist:
        return None


@database_sync_to_async
def get_chat(chat_id):
    return Chat.objects.filter(id=chat_id).first()


@database_sync_to_async
def get_previous_messages(chat_id):
    messages = Message.objects.filter(chat_id=chat_id).order_by("timestamp")
    return [
        {
            "content": msg.content,
            "timestamp": str(msg.timestamp),
            "response": msg.response,
        }
        for msg in messages
    ]


@database_sync_to_async
def create_message(chat_id, user,   user_message):
    chat = Chat.objects.get(id=chat_id)
    return Message.objects.create(sender=user, chat=chat, content=user_message)


@database_sync_to_async
def update_message_response(message, response):
    message.response = response
    message.save()
