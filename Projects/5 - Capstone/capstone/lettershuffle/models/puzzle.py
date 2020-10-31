from uuid import uuid4

from django.db import models


class Puzzle(models.Model):
    """"""

    name = models.TextField()
    details = models.TextField()
    img_url = models.URLField(blank=True)
    uuid = models.UUIDField(default=uuid4, editable=False)