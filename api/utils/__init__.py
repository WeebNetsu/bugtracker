from db import session
from db.users import User


def getUserOnSupabaseId(user_supabase_id: str) -> User | None:
    """
    Get user from database via their supabase id
    """
    user = session.query(User).filter(User.supabase_id == user_supabase_id).first()

    return None if not user else user
