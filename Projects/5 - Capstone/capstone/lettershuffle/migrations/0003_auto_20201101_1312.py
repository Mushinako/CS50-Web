# Generated by Django 3.1.2 on 2020-11-01 21:12

from django.db import migrations, models
import lettershuffle.utils


class Migration(migrations.Migration):

    dependencies = [
        ('lettershuffle', '0002_auto_20201031_1934'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='puzzle',
            name='uuid',
        ),
        migrations.AddField(
            model_name='puzzle',
            name='uniq_str',
            field=models.CharField(default=lettershuffle.utils.random_string, editable=False, max_length=10),
        ),
    ]
