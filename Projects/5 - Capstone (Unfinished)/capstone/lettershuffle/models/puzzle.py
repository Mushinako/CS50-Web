from django.db import models

from ..utils import RANDOM_STRING_DEFAULT_LENGTH, random_string


class Puzzle(models.Model):
    """"""

    name = models.TextField()
    details = models.TextField()
    img_url = models.URLField(blank=True)
    uniq_str = models.CharField(
        max_length=RANDOM_STRING_DEFAULT_LENGTH,
        default=random_string,
        editable=False,
    )
