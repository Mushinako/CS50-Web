from math import ceil
from typing import Optional

from django.db.models import Max
from django.http import HttpResponseRedirect
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.urls import reverse

from .error import _400, _403
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
    user = request.user
    # Check user is logged in
    if not user.is_authenticated:
        return _403(request)
    id_str = request.POST.get("id_", None)
    action = request.POST.get("action", None)
    # Check parameter existence
    if None in (id_str, action):
        return _400(request)
    try:
        id_ = int(id_str)
        lt = Listing.objects.get(id=id_)
    except (ValueError, Listing.DoesNotExist) as err:
        return _400(request, err)
    # Add to watchlist
    if action == "add":
        # Do not duplicate
        if not Watch.objects.filter(user=user, listing=lt).exists():
            watch = Watch(user=request.user, listing=lt)
            watch.save()
        return HttpResponseRedirect(reverse("listing", kwargs={"id_": id_}))
    # Remove from watchlist
    elif action == "remove":
        Watch.objects.filter(user=user, listing=lt).delete()
        return HttpResponseRedirect(reverse("listing", kwargs={"id_": id_}))
    else:
        return _400(request)


def bid(request: HttpRequest) -> HttpResponse:
    """
    Bid a listing
    """
    # Enforce "POST"
    if request.method != "POST":
        return _400(request)
    user = request.user
    # Check user is logged in
    if not user.is_authenticated:
        return _403(request)
    id_str = request.POST.get("id_", None)
    bid_str = request.POST.get("bid", None)
    # Check parameter existence
    if None in (id_str, bid_str):
        return _400(request)
    try:
        bid = ceil(float(bid_str)*100)
        id_ = int(id_str)
        lt = Listing.objects.get(id=id_)
    except (ValueError, Listing.DoesNotExist) as err:
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
        return HttpResponseRedirect(reverse("listing",
                                            kwargs={"id_": id_, "bid_err": True}))
    # Add new bid
    new_bid = Bid(user=user, listing=lt, amount=bid)
    new_bid.save()
    return HttpResponseRedirect(reverse("listing", kwargs={"id_": id_}))


def close(request: HttpRequest) -> HttpResponse:
    """
    Close a listing
    """
    # Enforce "POST"
    if request.method != "POST":
        return _400(request)
    id_str = request.POST.get("id_", None)
    # Check parameter existence
    if id_str == None:
        return _400(request)
    try:
        id_ = int(id_str)
        lt = Listing.objects.get(id=id_)
    except (ValueError, Listing.DoesNotExist) as err:
        return _400(request, err)
    # Check user is the creator
    if request.user != lt.created_by:
        return _403(request)
    # Mark nonactive
    lt.active = False
    lt.save()
    return HttpResponseRedirect(reverse("listing", kwargs={"id_": id_}))


# TODO: Create listing; Comment
