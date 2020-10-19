import random

from django import forms
from django.http import HttpRequest, HttpResponse
from django.http.response import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.urls.base import resolve
from markdown2 import markdown

from . import util


class NewWikiForm(forms.Form):
    """
    Form object for wiki editor
    """
    title = forms.CharField(required=True, label="Title")
    content = forms.CharField(widget=forms.Textarea, label="Content")


class EditWikiForm(forms.Form):
    """
    Form object for wiki editor
    """
    hidden_title = forms.CharField(widget=forms.HiddenInput)
    title = forms.CharField(label="Title", disabled=True)
    content = forms.CharField(widget=forms.Textarea, label="Content")


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
    })


def wikipage(request: HttpRequest, title: str) -> HttpResponse:
    """
    Render the Wiki page given the title
    """
    # Check if there's a match in different case
    wiki_entries_map = {e.lower(): e for e in util.list_entries()}
    title_lower = title.lower()
    # No match even case insensitive; render error
    if title_lower not in wiki_entries_map:
        return render(request, "encyclopedia/errors/wikipage.html", {
            "title": title,
        }, status=404)
    real_title = wiki_entries_map[title_lower]
    # Case insensitive match; redirect
    if title != real_title:
        return HttpResponseRedirect(reverse("wikipage", kwargs={"title": real_title}))
    content = util.get_entry(real_title)
    content_html = markdown(content)
    # Case sensitive match; render content
    return render(request, "encyclopedia/wikipage.html", {
        "title": title,
        "content": content_html,
        "from": title,
    })


def search(request: HttpRequest) -> HttpResponse:
    """
    Search given keywords
    """
    query = request.GET.get("q", None)
    # If no query, go back to homepage
    if query is None:
        return HttpResponseRedirect(reverse("index"))
    # Check if there's a match in different case
    wiki_entries_map = {e.lower(): e for e in util.list_entries()}
    query_lower = query.lower()
    # Exact match
    if query_lower in wiki_entries_map:
        return wikipage(request, query)
    match_lowers = {e_lower: e
                    for e_lower, e in wiki_entries_map.items()
                    if query_lower in e_lower}
    # No match even case insensitive; render error
    if not match_lowers:
        return render(request, "encyclopedia/errors/search.html", {
            "query": query,
        }, status=404)
    # Matches; render list
    return render(request, "encyclopedia/search.html", {
        "query": query,
        "entries": match_lowers.values(),
    })


def random_page(request: HttpRequest) -> HttpResponse:
    """
    Redirect to a random page
    """
    entries = util.list_entries()
    from_ = request.GET["from"]
    # Avoid navigating back to same page
    if from_ in entries:
        entries.remove(from_)
    rand = random.choice(entries)
    return HttpResponseRedirect(reverse("wikipage", kwargs={"title": rand}))


def new_page(request: HttpRequest) -> HttpResponse:
    """
    Add new page
    """
    if request.method == "GET":
        form = NewWikiForm()
        return render(request, "encyclopedia/editor.html", {
            "form": form,
            "url": reverse("new_page"),
        })
    elif request.method == "POST":
        title = request.POST.get("title", None)
        content = request.POST.get("content", None)
        if title is None or content is None:
            return render(request, "encyclopedia/errors/400.html", {
                "url": request.build_absolute_uri(),
                "query": dict(request.POST),
            }, status=400)
        util.save_entry(title, content)
        return HttpResponseRedirect(reverse("wikipage", kwargs={"title": title}))


def edit_page(request: HttpRequest) -> HttpResponse:
    """
    Edit existing page
    """
    if request.method == "GET":
        title = request.GET.get("title", None)
        if title is None:
            return render(request, "encyclopedia/errors/400.html", {
                "url": request.build_absolute_uri(),
            }, status=400)
        content = util.get_entry(title)
        if content is None:
            return render(request, "encyclopedia/errors/400.html", {
                "url": request.build_absolute_uri(),
            }, status=400)
        form = EditWikiForm(initial={
            "title": title,
            "hidden_title": title,
            "content": content,
        })
        return render(request, "encyclopedia/editor.html", {
            "form": form,
            "url": reverse("edit_page"),
        })
    elif request.method == "POST":
        title = request.POST.get("hidden_title", None)
        content = request.POST.get("content", None)
        if title is None or content is None:
            return render(request, "encyclopedia/errors/400.html", {
                "url": request.build_absolute_uri(),
                "query": dict(request.POST),
            }, status=400)
        util.save_entry(title, content)
        return HttpResponseRedirect(reverse("wikipage", kwargs={"title": title}))
