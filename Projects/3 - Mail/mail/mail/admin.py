from django.contrib import admin

from .models import User, Email

# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = [field.name for field in User._meta.fields
                    if field.name != "password"]
    list_editable = [field.name for field in User._meta.fields
                     if field.name not in ("id", "creation_time", "password")]


class EmailAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Email._meta.fields]
    list_editable = [field.name for field in Email._meta.fields
                     if field.name not in ("id", "timestamp")]
    filter_horizontal = ("recipients",)


admin.site.register(User, UserAdmin)
admin.site.register(Email, EmailAdmin)
