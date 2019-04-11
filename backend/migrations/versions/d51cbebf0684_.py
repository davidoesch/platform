"""empty message

Revision ID: d51cbebf0684
Revises: c59f1ce5a3dc
Create Date: 2019-04-03 14:12:58.939792

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd51cbebf0684'
down_revision = 'c59f1ce5a3dc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('slug', sa.String(length=64), nullable=True))
    op.create_unique_constraint(None, 'project', ['slug'])
    op.drop_column('resource', 'pipeline')
    op.drop_column('resource', 'doc_url')
    op.drop_column('resource', 'license')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('resource', sa.Column('license', sa.VARCHAR(length=64), autoincrement=False, nullable=True))
    op.add_column('resource', sa.Column('doc_url', sa.VARCHAR(length=256), autoincrement=False, nullable=True))
    op.add_column('resource', sa.Column('pipeline', sa.TEXT(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'project', type_='unique')
    op.drop_column('project', 'slug')
    # ### end Alembic commands ###
