from typing import Optional

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from .error import _404
from ..models import Bid, Category, Listing, User


def index(request: HttpRequest) -> HttpResponse:
    listings = Listing.objects.filter(active=True)
    return render(request, "auctions/index.html", {
        "listings": listings,
    })


def listing(request: HttpRequest, id_: str, bid_err: bool = False) -> HttpResponse:
    """
    Listing details page
    """
    try:
        id_ = int(id_)
        lt = Listing.objects.get(id=id_)
    except (ValueError, Listing.DoesNotExist) as err:
        return _404(request, err)
    watches: User.objects = lt.watched_by
    watching = watches.filter(id=request.user.id).exists()
    is_owner = lt.created_by == request.user
    bids: Bid.objects = lt.bids
    all_bids = bids.all()
    num_bids = all_bids.count()
    no_bids = num_bids == 0
    num_bids_str = f"{num_bids} bid{'' if num_bids == 1 else 's'}"
    max_bid = all_bids.order_by("-amount").first()
    if max_bid is None:
        is_max_bid = False
        max_bid_amount = lt.starting_bid
    else:
        is_max_bid = max_bid.user == request.user
        max_bid_amount = max_bid.amount
    max_bid_amount_str = f"{max_bid_amount/100:,.2f}"
    min_starting_bid_str = f"{(max_bid_amount*1.1)/100:,.2f}"
    return render(request, "auctions/listing.html", {
        "lt": lt,
        "watching": watching,
        "is_owner": is_owner,
        "no_bids": no_bids,
        "num_bids": num_bids_str,
        "is_max_bid": is_max_bid,
        "max_bid": max_bid_amount_str,
        "min_starting_bid": min_starting_bid_str,
        "currency": "$",
        "bid_err": bid_err,
    })


def category(request: HttpRequest, category: Optional[str] = None) -> HttpResponse:
    """
    View listings by category
    """
    # All category page
    if category is None:
        categories = Category.objects.all()
        return render(request, "auctions/categories.html", {
            "categories": categories,
        })
    # Specific category
    else:
        category_obj = Category.objects.filter(
            name=category, active=True).first()
        if category_obj is None:
            return _404(request)
        listings: Listing.objects = category_obj.listings
        listing_elements = listings.all()
        return render(request, "auctions/category.html", {
            "cat_name": category,
            "listings": listing_elements,
        })
