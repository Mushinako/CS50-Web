from django.contrib import admin

from .models import Bid, Category, Comment, Listing, User, Watch

# Register your models here.


class BidAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Bid._meta.fields]


class CategoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Category._meta.fields]


class CommentAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Comment._meta.fields]


class ListingAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Listing._meta.fields]
    filter_horizontal = ("categories",)


class UserAdmin(admin.ModelAdmin):
    list_display = [field.name for field in User._meta.fields
                    if field.name != "password"]


class WatchAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Watch._meta.fields]


admin.site.register(Bid, BidAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Listing, ListingAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Watch, WatchAdmin)
