from rest_framework import serializers
from blogs.models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    author = serializers.CharField(read_only=True)
    class Meta:
        model = Comment
        fields = ('id', 'post', 'author', 'content', 'created_at')

class BlogSerializer(serializers.ModelSerializer):
    author = serializers.CharField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False)
    slug = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'slug','author', 'image', 'comments', 'created_at')
        read_only_fields = ('author', 'created_at')

