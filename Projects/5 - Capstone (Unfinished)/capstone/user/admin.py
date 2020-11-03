from django.contrib import admin

# Register your models here.
from .models.users import Access, Attempt, User


class AccessAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Access._meta.fields]
    list_editable = [
        field.name
        for field in Access._meta.fields
        if field.name not in ("id", "creation_time", "access_time")
    ]


class AttemptAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Attempt._meta.fields]
    list_editable = [
        field.name
        for field in Attempt._meta.fields
        if field.name not in ("id", "creation_time")
    ]


class UserAdmin(admin.ModelAdmin):
    list_display = [
        field.name for field in User._meta.fields if field.name != "password"
    ]
    list_editable = [
        field.name
        for field in User._meta.fields
        if field.name not in ("id", "creation_time", "password")
    ]


admin.site.register(Access, AccessAdmin)
admin.site.register(Attempt, AttemptAdmin)
admin.site.register(User, UserAdmin)