# Generated by Django 4.2.12 on 2024-10-02 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finances', '0002_alter_finance_payer_split'),
    ]

    operations = [
        migrations.AddField(
            model_name='financecategory',
            name='icon',
            field=models.CharField(default='restaurant-outline', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='financecategory',
            name='icon_color',
            field=models.CharField(default=123, max_length=100),
            preserve_default=False,
        ),
    ]
