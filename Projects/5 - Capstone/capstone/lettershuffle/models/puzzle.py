from uuid import uuid4

from django.db import models


class Puzzle(models.Model):
    """"""

    name = models.TextField()
    bio_url = models.URLField()
    img_url = models.URLField(blank=True)
    uuid = models.UUIDField(default=uuid4, editable=False)