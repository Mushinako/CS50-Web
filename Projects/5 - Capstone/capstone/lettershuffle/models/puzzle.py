import uuid
from django.db import models


class Puzzle(models.Model):
    name = models.TextField()
    bio_url = models.URLField()
    img_url = models.URLField(blank=True)
    uuid_ = models.UUIDField(default=uuid.uuid4, editable=False)