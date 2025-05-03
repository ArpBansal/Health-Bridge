from rest_framework import permissions


class IsOrganisation(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the role 'organisation'
        return request.user and request.user.is_authenticated and request.user.role == 'organisation'