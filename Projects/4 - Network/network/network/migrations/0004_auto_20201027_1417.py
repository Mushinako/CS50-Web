# Generated by Django 3.1.2 on 2020-10-27 21:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_auto_20201026_1557'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='last_edit_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]