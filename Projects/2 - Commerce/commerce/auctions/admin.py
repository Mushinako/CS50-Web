from django.contrib import admin

from .models import Listing, Comment, Bid, Category, Watch

# Register your models here.
admin.site.register(Bid)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Listing)
admin.site.register(Watch)
