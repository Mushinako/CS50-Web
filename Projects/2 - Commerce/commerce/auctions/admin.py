from django.contrib import admin

from .models import Listing, Comment, Bid

# Register your models here.
for model in (Listing, Comment, Bid):
    admin.site.register(model)
