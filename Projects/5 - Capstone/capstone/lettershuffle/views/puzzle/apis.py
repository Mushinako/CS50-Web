import random
from hashlib import sha512
from typing import Dict

from django.http import HttpRequest, JsonResponse

from ...models.puzzle import Puzzle
from ....user.models.users import User


def puzzle_play_info(puzzle: Puzzle) -> Dict[str, str]:
    """"""
    shuffled_name = puzzle.name
    while shuffled_name == puzzle.name:
        shuffled_name = list(puzzle.name.replace(" ", ""))
        random.shuffle(shuffled_name)
        shuffled_name = "".join(shuffled_name)
    return {
        "shuffled_name": shuffled_name,
        "uuid": puzzle.uuid,
    }


def puzzle_success_info(puzzle: Puzzle) -> Dict[str, str]:
    """"""
    return {
        "name": puzzle.name,
        "details": puzzle.details,
        "img_url": puzzle.img_url,
    }


def puzzle_get_api(req: HttpRequest) -> JsonResponse:
    """
    Get puzzle represented as JSON
     - Method not GET            : 405
     - Requested puzzle not found: 404
     - Successful                : 200
    """
    if req.method != "GET":
        return JsonResponse(
            {"msg": f"Expected request method GET; got {req.method}."},
            status=405,
        )
    uuid = req.GET.get("uuid", None)
    # uuid not specified; get random puzzle without the uuid
    if uuid is None:
        user: User = req.user
        attempted_problems_manager: Puzzle.objects = user.attempted_problems
        attempted_problems = (
            attempted_problems_manager.all().values_list("id").distinct()
        )
        puzzle = Puzzle.objects.exclude(id__in=attempted_problems).order_by("?").first()
    # uuid specified; get puzzle with the uuid
    else:
        try:
            puzzle = Puzzle.objects.get(uuid=uuid)
        except Puzzle.DoesNotExist:
            return JsonResponse(
                {"msg": f"No puzzle with {uuid=} exists."},
                status=404,
            )
    # Return puzzle
    return JsonResponse(
        puzzle_play_info(puzzle),
        status=200,
    )


def puzzle_check_api(req: HttpRequest) -> JsonResponse:
    """
    Check puzzle submission
     - Method not POST           : 405
     - Missing parameters        : 400
     - Requested puzzle not found: 404
     - Wrong solution            : 200
     - Correct solution          : 200
    """
    if req.method != "POST":
        return JsonResponse(
            {"msg": f"Expected request method POST; got {req.method}."},
            status=405,
        )
    solution = req.POST.get("solution", None)
    uuid = req.POST.get("uuid", None)
    if None in (solution, uuid):
        return JsonResponse(
            {
                "msg": f"Some of the following parameters are undefined: {['solution', 'uuid']}.",
            },
            status=400,
        )
    try:
        puzzle = Puzzle.objects.get(uuid=uuid)
    except Puzzle.DoesNotExist:
        return JsonResponse(
            {"msg": f"No puzzle with {uuid=} exists."},
            status=404,
        )
    if sha512(solution).hexdigest() != sha512(puzzle.name.replace(" ", "")).hexdigest():
        return JsonResponse(
            {"correct": False},
            status=200,
        )
    return JsonResponse(
        {
            "correct": True,
            **puzzle_success_info(puzzle),
        },
        status=200,
    )


def puzzle_new_api(req: HttpRequest) -> JsonResponse:
    """
    Add new puzzle
     - Method not POST             : 405
     - Missing parameters          : 400
     - Puzzle with same name exists: 400
     - Saved                       : 200
    """
    if req.method != "POST":
        return JsonResponse(
            {"msg": f"Expected request method POST ; got {req.method}."},
            status=405,
        )
    name = req.POST.get("name", None)
    details = req.POST.get("details", None)
    img_url = req.POST.get("img_url", None)
    name = name.strip()
    if Puzzle.objects.filter(name=name).count() != 0:
        return JsonResponse({"msg": f"A puzzle named {name} already exists."})
    puzzle = Puzzle(name=name, details=details, img_url=img_url)
    puzzle.save()
    return JsonResponse(
        {"msg": "Success."},
        status=200,
    )
