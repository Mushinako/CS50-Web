from django import template

from ..models import Like, Post, User

register = template.Library()

VISIBLE_CLASS_NAME = "button-visible"
HIDDEN_CLASS_NAME = "button-hidden"


@register.simple_tag()
def liked_class(user: User, post: Post, reverse: bool) -> str:
    try:
        Like.objects.get(user=user, post=post)
    except Like.DoesNotExist:
        reverse = not reverse
    return " " + (HIDDEN_CLASS_NAME if reverse else VISIBLE_CLASS_NAME)
