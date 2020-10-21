from typing import Optional
from django.http import HttpRequest, HttpResponse
from django.http import request
from django.shortcuts import render

from .error import _404
from .util import gen_listing_bid, gen_listing_forms
from .var import CURRENCY_SYMBOL
from ..models import Category, Comment, Listing, User


def index(request: HttpRequest) -> HttpResponse:
    listings = Listing.objects.filter(active=True)
    return render(request, "auctions/index.html", {
        "listings": listings,
        "currency": CURRENCY_SYMBOL,
    })


def listing(request: HttpRequest, id_: int, bid_err: Optional[str] = None) -> HttpResponse:
    """
    Listing details page
    """
    try:
        lt = Listing.objects.get(id=id_)
    except Listing.DoesNotExist as err:
        return _404(request, err)
    # Bidding info
    is_owner = lt.created_by == request.user
    lb = gen_listing_bid(request, lt)
    # Watchlist
    watches: User.objects = lt.watched_by
    watching = watches.filter(id=request.user.id).exists()
    # Comments
    comments_manager: Comment.objects = lt.comments
    comments = comments_manager.all()
    # Forms
    lf = gen_listing_forms(lt, lb, watching)
    return render(request, "auctions/listing.html", {
        "lt": lt,
        "lb": lb,
        "lf": lf,
        "bid_err": bid_err,
        "is_owner": is_owner,
        "watching": watching,
        "comments": comments,
    })


def categories(request: HttpRequest) -> HttpResponse:
    """
    View all categories
    """
    categories = Category.objects.all()
    return render(request, "auctions/categories.html", {
        "categories": categories,
    })


def category(request: HttpRequest, category: str) -> HttpResponse:
    """
    View listings by category
    """
    category_obj = Category.objects.filter(
        name=category).first()
    if category_obj is None:
        return _404(request)
    listings: Listing.objects = category_obj.listings
    listing_elements = listings.filter(active=True)
    return render(request, "auctions/category.html", {
        "cat_name": category,
        "listings": listing_elements,
    })


def comment_new(request: HttpRequest, lt_id: int) -> HttpResponse:
    """
    """


def comment_edit(request: HttpRequest, com_id: int) -> HttpResponse:
    """
    """
