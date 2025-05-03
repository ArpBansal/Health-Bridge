from django.shortcuts import render
from chat.serializers import MessageSerializer, ChatSerializer
from chat.models import Message, Chat
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics, permissions


class ChatListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        chats = Chat.objects.filter(user=request.user).order_by('-created_at')
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)
    

    def post(self, request):
        chat = Chat.objects.create(user=request.user)
        serializer = ChatSerializer(chat)
        return Response(serializer.data, status=201)
    

class ChatMessagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, chat_id):
        try:
            chat = Chat.objects.get(id=chat_id, user=request.user)
        except Chat.DoesNotExist:
            return Response({"detail": "Chat not found."}, status=404)

        messages = Message.objects.filter(chat=chat).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, chat_id):
        try:
            chat = Chat.objects.get(id=chat_id, user=request.user)
        except Chat.DoesNotExist:
            return Response({"detail": "Chat not found."}, status=404)
            
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(chat=chat, sender=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)




