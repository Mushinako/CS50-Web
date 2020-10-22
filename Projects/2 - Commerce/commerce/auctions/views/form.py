from typing import Optional
from django import forms

from .var import CURRENCY_SYMBOL
from ..models import Category


class IdForm(forms.Form):
    _id = forms.IntegerField(min_value=1,  widget=forms.HiddenInput())


class WatchForm(IdForm):
    ADD = "add"
    REMOVE = "remove"
    _action = forms.ChoiceField(
        choices=[(ADD, "add"), (REMOVE, "remove")],
        widget=forms.HiddenInput())


class CloseForm(IdForm):
    pass


class BidForm(IdForm):
    bid = forms.DecimalField()

    def __init__(self, *args, bid_min_value: Optional[float] = None, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        if bid_min_value is not None:
            self.fields["bid"] = forms.DecimalField(
                min_value=bid_min_value, decimal_places=2,
                widget=forms.NumberInput(attrs={
                    "id": "id-bid",
                }), label=CURRENCY_SYMBOL, label_suffix="")


class BidDisabledForm(forms.Form):
    bid = forms.CharField(widget=forms.NumberInput(attrs={
        "id": "id-bid",
    }), label=CURRENCY_SYMBOL, initial="Log in to start bidding!", disabled=True,
        label_suffix="")


class CommentForm(IdForm):
    title = forms.CharField(
        max_length=64, widget=forms.TextInput(attrs={
            "placeholder": "Title",
        }), label="Title")
    content = forms.CharField(
        max_length=1024, required=False, widget=forms.Textarea(attrs={
            "placeholder": "Message (Optional)"
        }), label="Message")


class CommentDisabledForm(forms.Form):
    title = forms.CharField(
        label="Title", initial="Log in to leave a comment!", disabled=True)
    content = forms.CharField(
        widget=forms.Textarea(), label="Message",
        initial="Log in to leave a comment!", disabled=True)


class NewForm(forms.Form):
    title = forms.CharField(
        max_length=64, widget=forms.TextInput(attrs={
            "placeholder": "Title",
        }), label="Title")
    description = forms.CharField(
        max_length=1024, required=False, widget=forms.Textarea(attrs={
            "placeholder": "Description (Optional)"
        }), label="Description")
    starting_bid = forms.DecimalField(
        decimal_places=2, widget=forms.NumberInput(attrs={
            "id": "id-bid",
        }), label=CURRENCY_SYMBOL, label_suffix="")
    image_url = forms.URLField(required=False, label="Image URL (Optional)")
    categories = forms.MultipleChoiceField(
        choices=[(cat.name, cat) for cat in Category.objects.all()],
        required=False, label="Categories (Optional)")
