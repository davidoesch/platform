"""empty message

Revision ID: 16080f1821df
Revises: 37a8cc7186ff
Create Date: 2019-04-05 11:47:04.800261

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '16080f1821df'
down_revision = '37a8cc7186ff'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('source', sa.Column('organisation_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'source', 'organisation', ['organisation_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'source', type_='foreignkey')
    op.drop_column('source', 'organisation_id')
    # ### end Alembic commands ###