from django.urls import path
from .views import ChatListView, ChatMessagesView

urlpatterns = [
    path("chats/", ChatListView.as_view(), name="chat-list"),
    path("chat/<uuid:chat_id>/messages/", ChatMessagesView.as_view(), name="chat-messages"),\
    # path("chatbot/", index, name="index"),
]
