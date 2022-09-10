from db import session
from db.users import User


def get_user_with_id(user_id: str | int) -> User | None:
    """
    Get user from database via their supabase OR normal ID
    """
    filter_item = User.id

    if type(user_id) == str:
        filter_item = User.supabase_id

    user: User | None = session.query(User).filter(filter_item == user_id).first()

    return user
