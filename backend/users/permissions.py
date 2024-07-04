from rest_framework import permissions

class UsersVIEWPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return not request.user.is_authenticated
        elif request.method in ['GET','PUT', 'DELETE']:
            return request.user.is_authenticated
        return False