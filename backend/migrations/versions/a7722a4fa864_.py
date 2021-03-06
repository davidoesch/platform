"""empty message

Revision ID: a7722a4fa864
Revises: a4d289b9abd3
Create Date: 2019-04-21 13:41:37.477670

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a7722a4fa864'
down_revision = 'a4d289b9abd3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('source', sa.Column('license_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'source', 'license', ['license_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'source', type_='foreignkey')
    op.drop_column('source', 'license_id')
    # ### end Alembic commands ###
