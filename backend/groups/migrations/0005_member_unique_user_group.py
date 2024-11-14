# Generated by Django 4.2.12 on 2024-11-01 03:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0004_groupinvitecode'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='member',
            constraint=models.UniqueConstraint(condition=models.Q(('user__isnull', False)), fields=('user', 'group'), name='unique_user_group'),
        ),
    ]