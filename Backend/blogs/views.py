from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from blogs.models import Post, Comment
from blogs.serializers import BlogSerializer, CommentSerializer
from blogs.permissions import IsAuthorOrAdmin, IsOwnerOrReadOnly


class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthorOrAdmin]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthorOrAdmin]
    lookup_field = 'slug'  # <--- changed from pk to slug


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        if not slug:
            raise NotFound(detail="Post slug is required in the URL.", code=400)

        try:
            post = Post.objects.get(slug=slug)
        except Post.DoesNotExist:
            raise NotFound(detail="Post not found.", code=404)

        comments = Comment.objects.filter(post=post)
        if not comments.exists():
            raise NotFound(detail="No comments found for this post.", code=404)

        return comments

    def perform_create(self, serializer):
        slug = self.kwargs.get('slug')
        post = get_object_or_404(Post, slug=slug)
        serializer.save(author=self.request.user, post=post)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer    
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'pk'
