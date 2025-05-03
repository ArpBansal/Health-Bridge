from django.db import models
from django.contrib.auth.models import User, AbstractUser
# Create your models here.


class CustomUser(AbstractUser):

    USER_ROLE_CHOICE = (
        ("user", "User"),
        ("organisation", "Organisation"),
    )

    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    role = models.CharField(choices=USER_ROLE_CHOICE,  max_length=20, null=True, blank=True)
