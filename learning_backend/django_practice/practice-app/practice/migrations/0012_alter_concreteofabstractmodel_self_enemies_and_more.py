# Generated by Django 5.0.3 on 2024-03-29 18:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('practice', '0011_concreteofabstractmodel_self_enemies'),
    ]

    operations = [
        migrations.AlterField(
            model_name='concreteofabstractmodel',
            name='self_enemies',
            field=models.ManyToManyField(blank=True, to='practice.concreteofabstractmodel'),
        ),
        migrations.AlterField(
            model_name='concreteofabstractmodel',
            name='self_friends',
            field=models.ManyToManyField(blank=True, to='practice.concreteofabstractmodel'),
        ),
    ]