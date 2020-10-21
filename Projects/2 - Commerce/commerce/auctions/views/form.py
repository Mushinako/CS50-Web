from typing import Optional
from django import forms

from .util import CURRENCY_SYMBOL


class IdForm(forms.Form):
    id_ = forms.IntegerField(
        min_value=1, required=True, widget=forms.HiddenInput())


class WatchForm(IdForm):
    action = forms.ChoiceField(
        ("add", "remove"), required=True, widget=forms.HiddenInput())


class CloseForm(IdForm):
    pass


class BidForm(IdForm):
    bid = forms.DecimalField(decimal_places=2, label=CURRENCY_SYMBOL)

    def __init__(self, bid_min_value: Optional[float] = None, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        if bid_min_value is not None:
            self.fields["bid"] = forms.DecimalField(
                min_value=bid_min_value, decimal_places=2, label=CURRENCY_SYMBOL)


class BidDisabledForm(forms.Form):
    bid = forms.CharField(label=CURRENCY_SYMBOL,
                          initial="Log in to start bidding!", disabled=True)


class CommentDisabledForm(forms.Form):
    bid = forms.CharField(label=CURRENCY_SYMBOL,
                          initial="Log in to leave a comment!",
                          widget=forms.Textarea(), disabled=True)
