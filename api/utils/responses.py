import re


def generate_response(
    data: dict | list | None = None, message: str = "Success", code: int = 200
):
    """
    Generate response model
    """
    return {
        "data": data,
        "code": code,
        "message": message,
    }


def convert_to_camel_case(name: str) -> str:
    """
    Converts a string to camel case
    """
    return re.compile(r"_([a-z])").sub(lambda x: x.group(1).upper(), name)


def convert_json(data: dict | list[dict] | tuple[dict]) -> dict | list[dict]:
    """
    Converts a dictionary to camel case for JSON use
    """

    # check if type of data is dict or list
    if isinstance(data, dict):
        new_d = {}
        for k, v in data.items():
            new_d[convert_to_camel_case(k)] = (
                convert_json(v, convert_to_camel_case) if isinstance(v, dict) else v
            )
        return new_d
    elif isinstance(data, list) or isinstance(data, tuple):
        new_l = []
        for item in data:
            new_d = {}
            for k, v in item.items():
                new_d[convert_to_camel_case(k)] = (
                    convert_json(v, convert_to_camel_case) if isinstance(v, dict) else v
                )
            new_l.append(new_d)
        return new_l

    return data
