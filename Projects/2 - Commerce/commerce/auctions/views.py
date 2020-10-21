from typing import Optional
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.defaults import bad_request, page_not_found, permission_denied

from .models import Category, User, Listing, Watch, Bid


def index(request: HttpRequest) -> HttpResponse:
    listings = Listing.objects.all()
    return render(request, "auctions/index.html", {
        "listings": listings,
    })


def login_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request) -> HttpResponse:
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


def listing(request: HttpRequest, id_: str) -> HttpResponse:
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
    if all_bids:
        max_bid = max(all_bids, key=lambda b: b.amount)
        is_max_bid = max_bid.user == request.user
        max_bid_amount = max_bid.amount
    else:
        is_max_bid = False
        max_bid_amount = lt.starting_bid
    max_bid_amount_str = f"{max_bid_amount/100:,.2f}"
    min_starting_bid_str = f"{(max_bid_amount+1)/100:,.2f}"
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
    })


def watch(request: HttpRequest) -> HttpResponse:
    """
    Add to or remove from watchlist
    """
    # Enforce "POST"
    if request.method != "POST":
        return _400(request)
    action = request.POST.get("action", None)
    id_ = request.POST.get("id_", None)
    # Check parameter existence
    if None in (action, id_):
        return _400(request)
    try:
        id_ = int(id_)
        lt = Listing.objects.get(id=id_)
    except (ValueError, Listing.DoesNotExist) as err:
        return _404(request, err)
    user = request.user
    # Check user is logged in
    if not user.is_authenticated:
        return _403(request)
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
        category_obj = Category.objects.filter(name=category).first()
        if category_obj is None:
            return _404(request)
        listings: Listing.objects = category_obj.listings
        listing_elements = listings.all()
        return render(request, "auctions/category.html", {
            "cat_name": category,
            "listings": listing_elements,
        })


def bid(request: HttpRequest) -> HttpResponse:
    """
    Bid a listing
    """


def close(request: HttpRequest) -> HttpResponse:
    """
    Close a listing
    """


def _400(request: HttpRequest, exception=None) -> HttpResponse:
    return bad_request(request, exception)
    # return HttpResponseRedirect(reverse("index"))


def _403(request: HttpRequest, exception=None) -> HttpResponse:
    return permission_denied(request, exception)
    # return HttpResponseRedirect(reverse("index"))


def _404(request: HttpRequest, exception=None) -> HttpResponse:
    return page_not_found(request, exception)
    # return HttpResponseRedirect(reverse("index"))
