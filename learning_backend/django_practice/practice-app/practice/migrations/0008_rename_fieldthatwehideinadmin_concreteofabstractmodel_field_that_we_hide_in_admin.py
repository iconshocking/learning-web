# Generated by Django 5.0.3 on 2024-03-26 21:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('practice', '0007_concreteofabstractmodel_fieldthatwehideinadmin'),
    ]

    operations = [
        migrations.RenameField(
            model_name='concreteofabstractmodel',
            old_name='fieldThatWeHideInAdmin',
            new_name='field_that_we_hide_in_admin',
        ),
    ]
