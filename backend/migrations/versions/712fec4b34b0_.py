"""empty message

Revision ID: 712fec4b34b0
Revises: 523e4c992f6b
Create Date: 2018-08-30 15:43:38.687542

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '712fec4b34b0'
down_revision = '523e4c992f6b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('resource', sa.Column('notes', sa.UnicodeText(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('resource', 'notes')
    # ### end Alembic commands ###
