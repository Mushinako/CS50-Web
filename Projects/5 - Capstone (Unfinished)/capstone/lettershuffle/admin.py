from django.contrib import admin

# Register your models here.
from .models.puzzle import Puzzle


class PuzzleAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Puzzle._meta.fields]
    list_editable = [
        field.name
        for field in Puzzle._meta.fields
        if field.name not in ("id", "creation_time", "uniq_str")
    ]


admin.site.register(Puzzle, PuzzleAdmin)