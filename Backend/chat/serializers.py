from rest_framework import serializers
from chat.models import Message, Chat


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'content', 'response', 'timestamp']
        read_only_fields = ['id', 'chat', 'sender', 'response', 'timestamp']


class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    user = serializers.CharField(read_only=True)
    class Meta:
        model = Chat
        fields = ['id', 'user', 'messages', 'created_at']

