from math import ceil
from dataclasses import dataclass

from django.http import HttpRequest

from .form import (BidForm, BidDisabledForm, CloseForm,
                   CommentForm, CommentDisabledForm, WatchForm)
from .var import CURRENCY_SYMBOL
from ..models import Bid, Listing


@dataclass
class ListingBid():
    no_bids: bool
    num_bids: str
    is_max_bid: bool
    max_bid: str
    min_starting_bid: float
    currency: str


@dataclass
class ListingForms():
    close_form: CloseForm
    watch_form: WatchForm
    bid_form: BidForm
    bid_disabled_form = BidDisabledForm()
    comment_form: CommentForm
    comment_disabled_form = CommentDisabledForm()


def gen_listing_bid(request: HttpRequest, lt: Listing) -> ListingBid:
    """
    Generate listing bid information
    """
    bids_manager: Bid.objects = lt.bids
    bids = bids_manager.all()
    num_bids = bids.count()
    no_bids = num_bids == 0
    num_bids_str = f"{num_bids} bid{'' if num_bids == 1 else 's'}"
    if no_bids:
        is_max_bid = False
        max_bid_amount_int = lt.starting_bid
    else:
        max_bid = bids.order_by("-amount").first()
        is_max_bid = max_bid.user == request.user
        max_bid_amount_int: int = max_bid.amount
    max_bid_amount = f"{max_bid_amount_int/100:,.2f}"
    min_starting_bid = (max_bid_amount_int+1)/100
    lb = ListingBid(no_bids, num_bids_str, is_max_bid,
                    max_bid_amount, min_starting_bid, CURRENCY_SYMBOL)
    return lb


def gen_listing_forms(lt: Listing, lb: ListingBid, watching: bool) -> ListingForms:
    close_form = CloseForm(initial={"_id": lt.id})
    watch_form = WatchForm(initial={
        "_id": lt.id,
        "_action": WatchForm.REMOVE if watching else WatchForm.ADD,
    })
    bid_form = BidForm(initial={
        "_id": lt.id,
        "bid": ceil(lb.min_starting_bid)
    }, bid_min_value=lb.min_starting_bid)
    comment_form = CommentForm(initial={"_id": lt.id})
    lf = ListingForms(close_form, watch_form, bid_form, comment_form)
    return lf
