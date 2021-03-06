# Generated by Django 3.1.2 on 2020-10-31 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lettershuffle', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='attempt',
            old_name='solver',
            new_name='attempter',
        ),
        migrations.RemoveField(
            model_name='user',
            name='solved',
        ),
        migrations.AddField(
            model_name='user',
            name='attempts',
            field=models.ManyToManyField(blank=True, related_name='attempted_by', through='user.Attempt', to='lettershuffle.Puzzle'),
        ),
    ]
