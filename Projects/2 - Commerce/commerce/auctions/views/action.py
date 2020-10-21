from math import ceil
from typing import Dict, Optional

from django.db.models import Max
from django.http import HttpResponseRedirect
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.urls import reverse

from .error import _400, _403
from .form import BidForm, CloseForm, CommentForm, WatchForm
from ..models import Bid, Listing, Watch


def new_listing(request: HttpRequest) -> HttpResponse:
    """
    """


def comment(request: HttpRequest) -> HttpResponse:
    """
    Comment on a listing
    """


def watch(request: HttpRequest) -> HttpResponse:
    """
    Add to or remove from watchlist
    """
    # Enforce "POST"
    if request.method != "POST":
        return _400(request)
    f = WatchForm(request.POST)
    # Check form validity
    if not f.is_valid():
        return _400(request)
    user = request.user
    # Check user is logged in
    if not user.is_authenticated:
        return _403(request)
    data = f.cleaned_data
    id_ = data["_id"]
    action = data["_action"]
    # Check corresponding listing existence
    try:
        lt = Listing.objects.get(id=id_)
    except Listing.DoesNotExist as err:
        return _400(request, err)
    # Add to watchlist
    if action == WatchForm.ADD:
        # Do not duplicate
        if not Watch.objects.filter(user=user, listing=lt).exists():
            watch = Watch(user=request.user, listing=lt)
            watch.save()
        return HttpResponseRedirect(reverse("listing", kwargs={"id_": id_}))
    # Remove from watchlist
    elif action == WatchForm.REMOVE:
        Watch.objects.filter(user=user, listing=lt).delete()
        return HttpResponseRedirect(reverse("listing", kwargs={"id_": id_}))
    else:
        return _400(request)


def close(request: HttpRequest) -> HttpResponse:
    """
    Close a listing
    """
    # Enforce "POST"
    if request.method != "POST":
        return _400(request)
    f = CloseForm(request.POST)
    # Check form validity
    if not f.is_valid():
        return _400(request)
    data = f.cleaned_data
    id_ = data["_id"]
    # Check corresponding listing existence
    try:
        lt = Listing.objects.get(id=id_)
    except Listing.DoesNotExist as err:
        return _400(request, err)
    # Check user is the creator
    if request.user != lt.created_by:
        return _403(request)
    # Mark nonactive
    lt.active = False
    lt.save()
    return HttpResponseRedirect(reverse("listing", kwargs={"id_": id_}))


def bid(request: HttpRequest) -> HttpResponse:
    """
    Bid a listing
    """
    # Enforce "POST"
    if request.method != "POST":
        return _400(request)
    f = BidForm(request.POST)
    # Check form validity
    if not f.is_valid():
        return _400(request)
    user = request.user
    # Check user is logged in
    if not user.is_authenticated:
        return _403(request)
    data = f.cleaned_data
    id_ = data["id_"]
    bid_float = data["bid"]
    bid = ceil(bid_float * 100)
    try:
        lt = Listing.objects.get(id=id_)
    except Listing.DoesNotExist as err:
        return _400(request, err)
    # Check user is not the creator
    if user == lt.created_by:
        return _403(request)
    bids: Bid.objects = lt.bids
    max_bid_amount: Optional[int] = bids.aggregate(
        Max("amount"))["amount__max"]
    if max_bid_amount is None:
        max_bid_amount: int = lt.starting_bid
    # Check if the bid is larger than current
    if bid <= max_bid_amount:
        return HttpResponseRedirect(reverse("listing", kwargs={
            "id_": id_,
            "bid_err": "You've submitted an invalid bid!",
        }))
    # Add new bid
    new_bid = Bid(user=user, listing=lt, amount=bid)
    new_bid.save()
    return HttpResponseRedirect(reverse("listing", kwargs={"id_": id_}))
