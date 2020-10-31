from django.http import HttpRequest, JsonResponse
from django.urls import reverse

from ...models.puzzle import Puzzle


def get_puzzle_api(req: HttpRequest) -> JsonResponse:
    """
    Get puzzle represented as JSON
     - Method not GET: 400
    """
    if req.method != "GET":
        return JsonResponse(
            {
                "success": False,
                "msg": f"Expected request method: GET ; got {req.method}",
            },
            status=400,
        )
