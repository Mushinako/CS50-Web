from rest_framework import viewsets

from ..models.users import User
from ..seralizers.users import UserSerializer


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()