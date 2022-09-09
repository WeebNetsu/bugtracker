"""Added projects and tasks

Revision ID: 9faaaafcc69f
Revises: 73e5cfe7af7e
Create Date: 2022-09-07 14:06:44.822839

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9faaaafcc69f"
down_revision = "73e5cfe7af7e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("tasks", "text", existing_type=sa.VARCHAR(), nullable=False)
    op.alter_column("tasks", "user_id", existing_type=sa.INTEGER(), nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("tasks", "user_id", existing_type=sa.INTEGER(), nullable=True)
    op.alter_column("tasks", "text", existing_type=sa.VARCHAR(), nullable=True)
    op.drop_column("tasks", "tags")
    # ### end Alembic commands ###