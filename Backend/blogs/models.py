from django.db import models
from users.models import CustomUser
from ckeditor.fields import RichTextField

# Create your models here.

from django.utils.text import slugify

class Post(models.Model):
    title = models.CharField(max_length=250)
    slug = models.SlugField(unique=True, blank=True, max_length=200)  # <- new field
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = RichTextField()
    image = models.ImageField(upload_to="blog_images", null=True, blank=True)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Post.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} by {self.author}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now=True)