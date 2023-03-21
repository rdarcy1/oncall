# Generated by Django 3.2.18 on 2023-03-20 16:04

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone

import django_migration_linter as linter


class Migration(migrations.Migration):

    dependencies = [
        ('alerts', '0010_channelfilter_filtering_term_type'),
        ('webhooks', '0001_initial'),
    ]

    operations = [
        linter.IgnoreMigration(),
        migrations.CreateModel(
            name='WebhookResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('trigger_type', models.IntegerField(choices=[(0, 'Escalation step'), (1, 'Triggered'), (2, 'Acknowledged'), (3, 'Resolved'), (4, 'Silenced'), (5, 'Unsilenced'), (6, 'Unresolved')])),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('request_trigger', models.TextField(default=None, null=True)),
                ('request_headers', models.TextField(default=None, null=True)),
                ('request_data', models.TextField(default=None, null=True)),
                ('url', models.TextField(default=None, null=True)),
                ('status_code', models.IntegerField(default=None, null=True)),
                ('content', models.TextField(default=None, null=True)),
                ('alert_group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='webhook_responses', to='alerts.alertgroup')),
                ('webhook', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='responses', to='webhooks.webhook')),
            ],
        ),
        migrations.DeleteModel(
            name='WebhookLog',
        ),
    ]