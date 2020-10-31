import random
from typing import Dict

from django.http import HttpRequest, JsonResponse

from ...models.puzzle import Puzzle
from ....user.models.users import User


def puzzle_play_info(puzzle: Puzzle) -> Dict:
    """"""
    shuffled_name = list(puzzle.name)
    random.shuffle(shuffled_name)
    shuffled_name = "".join(shuffled_name)
    return {
        "shuffled_name": shuffled_name,
        "uuid": puzzle.uuid,
    }


def puzzle_success_info(puzzle: Puzzle) -> Dict:
    """"""
    return {
        "name": puzzle.name,
        "bio_url": puzzle.bio_url,
        "img_url": puzzle.img_url,
    }


def get_puzzle_api(req: HttpRequest) -> JsonResponse:
    """
    Get puzzle represented as JSON
     - Method not GET            : 400
     - Requested puzzle not found: 404
     - Successful                : 200
    """
    if req.method != "GET":
        return JsonResponse(
            {
                "success": False,
                "msg": f"Expected request method: GET ; got {req.method}",
            },
            status=400,
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
