from django import template

register = template.Library()


@register.filter(name="is_owner")
def is_owner(req_user, owner) -> bool:
    return req_user == owner
