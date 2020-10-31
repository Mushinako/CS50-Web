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
        "bio_url": puzzle.bio_url,
        "img_url": puzzle.img_url,
    }


def get_puzzle_api(req: HttpRequest) -> JsonResponse:
    """
    Get puzzle represented as JSON
     - Method not GET            : 405
     - Requested puzzle not found: 404
     - Successful                : 200
    """
    if req.method != "GET":
        return JsonResponse(
            {
                "success": False,
                "msg": f"Expected request method: GET ; got {req.method}",
            },
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
                {
                    "success": False,
                    "msg": f"No puzzle with {uuid=} exists.",
                },
                status=404,
            )
    # Return puzzle
    return JsonResponse(
        {
            "success": True,
            **puzzle_play_info(puzzle),
        },
        status=200,
    )


def submit_puzzle_api(req: HttpRequest) -> JsonResponse:
    """
    Check puzzle submission
     - Method not POS            : 405
     - Missing parameters        : 400
     - Requested puzzle not found: 404
     - Wrong solution            : 200
     - Correct solution          : 200
    """
    if req.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "msg": f"Expected request method: POST ; got {req.method}",
            },
            status=405,
        )
    solution = req.POST.get("solution", None)
    uuid = req.POST.get("uuid", None)
    if None in (solution, uuid):
        return JsonResponse(
            {
                "success": False,
                "msg": f"Some of the following parameters are undefined: {['solution', 'uuid']}",
            },
            status=400,
        )
    try:
        puzzle = Puzzle.objects.get(uuid=uuid)
    except Puzzle.DoesNotExist:
        return JsonResponse(
            {
                "success": False,
                "msg": f"No puzzle with {uuid=} exists.",
            },
            status=404,
        )
    if sha512(solution).hexdigest() != sha512(puzzle.name.replace(" ", "")).hexdigest():
        return JsonResponse(
            {
                "success": True,
                "correct": False,
            },
            status=200,
        )
    return JsonResponse(
        {
            "success": True,
            "correct": True,
            **puzzle_success_info(puzzle),
        },
        status=200,
    )
