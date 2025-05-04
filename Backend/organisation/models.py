from django.db import models


class DiagnosingImage(models.Model):
    image = models.ImageField(upload_to='uploads/patient_image/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name