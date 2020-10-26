from django.contrib import admin
from django.db import models

from .models import Follow, Like, Post, User

# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = [field.name for field in User._meta.fields
                    if field.name != "password"]
    list_editable = [field.name for field in User._meta.fields
                     if field.name not in ("id", "creation_time", "password")]


def createModelAdmin(cls: models.Model) -> admin.ModelAdmin:
    class ClsAdmin(admin.ModelAdmin):
        list_display = [field.name for field in cls._meta.fields]
        list_editable = [field.name for field in cls._meta.fields
                         if field.name not in ("id", "creation_time")]

    return ClsAdmin


admin.site.register(User, UserAdmin)
for cls in (Follow, Like, Post):
    ClsAdmin = createModelAdmin(cls)
    admin.site.register(cls, ClsAdmin)
