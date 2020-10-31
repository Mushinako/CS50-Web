from django.contrib import admin

# Register your models here.
from .models.users import User


class UserAdmin(admin.ModelAdmin):
    list_display = [
        field.name for field in User._meta.fields if field.name != "password"
    ]
    list_editable = [
        field.name
        for field in User._meta.fields
        if field.name not in ("id", "creation_time", "password")
    ]


admin.site.register(User, UserAdmin)