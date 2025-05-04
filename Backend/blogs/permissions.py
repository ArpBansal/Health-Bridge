from rest_framework import permissions

class IsAuthorOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow only authors or admins to create, update, or delete posts.
    Read access (GET) is allowed for everyone.
    """

    def has_permission(self, request, view):
        # Read-only access is allowed for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For POST (creating a blog post), only allow authors or admins
        return getattr(request.user, 'is_author', False) or request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # Read-only access is allowed for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Only the author of the post or an admin can edit or delete it
        return obj.author == request.user or request.user.is_staff


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
         if request.method in permissions.SAFE_METHODS:
             return True
         return obj.author == request.user and request.user.is_authenticated