from django.db import models
from users.models import CustomUser
import uuid
# Create your models here.


class Chat(models.Model):
    id=models.UUIDField(default=uuid.uuid4, editable=False,primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat {self.id}"
    

class Message(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content= models.TextField()
    response= models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Message by {self.sender} in {self.chat}"
