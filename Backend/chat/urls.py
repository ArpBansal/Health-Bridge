from django.urls import path
from .views import ChatListView, ChatMessagesView, ChatDetailView

urlpatterns = [
    path("chats/", ChatListView.as_view(), name="chat-list"),
    path("chat/<uuid:chat_id>/messages/", ChatMessagesView.as_view(), name="chat-messages"),
    path("chat/<uuid:chat_id>/", ChatDetailView.as_view(), name="chat-detail"),  
]
