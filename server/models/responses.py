def ResponseModel(data, message, code=200):
    return {
        "data": data,
        "code": code,
        "message": message,
    }
