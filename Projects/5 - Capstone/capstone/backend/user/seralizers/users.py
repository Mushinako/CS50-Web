from rest_framework import serializers

from ..models.users import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            field.name for field in User._meta.fields if field.name not in ("password",)
        ]
