"""empty message

Revision ID: a8045d00ed67
Revises: dbcd7d8df928
Create Date: 2018-08-30 15:18:47.746581

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a8045d00ed67'
down_revision = 'dbcd7d8df928'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('biography', sa.UnicodeText(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'biography')
    # ### end Alembic commands ###
