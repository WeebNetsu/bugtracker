from enum import Enum


class STATUS(str, Enum):  # use an enum to foce it to be one of the allowed
    TODO = ("TODO",)
    DOING = ("DOING",)
    COMPLETED = ("COMPLETED",)
