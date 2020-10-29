from django import template

from ..models import Follow, User

register = template.Library()

VISIBLE_CLASS_NAME = "button-visible"
HIDDEN_CLASS_NAME = "button-hidden"


@register.simple_tag()
def followed_class(follower: User, followee: User, reverse: bool) -> str:
    try:
        Follow.objects.get(follower=follower, followee=followee)
    except Follow.DoesNotExist:
        reverse = not reverse
    return HIDDEN_CLASS_NAME if reverse else VISIBLE_CLASS_NAME
