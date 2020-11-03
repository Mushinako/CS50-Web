import string
import random

RANDOM_CANDIDATE = string.ascii_letters + string.digits
RANDOM_STRING_DEFAULT_LENGTH = 10


def random_string(length: int = RANDOM_STRING_DEFAULT_LENGTH) -> str:
    return "".join(random.choices(RANDOM_CANDIDATE, k=length))