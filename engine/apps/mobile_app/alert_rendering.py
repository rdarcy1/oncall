from emoji import emojize

from apps.alerts.incident_appearance.templaters.alert_templater import AlertTemplater, TemplatedAlert
from apps.alerts.models import AlertGroup
from common.utils import str_or_backup

MAX_ALERT_TITLE_LENGTH = 200


class AlertMobileAppTemplater(AlertTemplater):
    def _render_for(self):
        return "MOBILE_APP"


def _get_templated_alert(alert_group: AlertGroup) -> TemplatedAlert:
    alert = alert_group.alerts.first()
    return AlertMobileAppTemplater(alert).render()


def get_push_notification_title(alert_group: AlertGroup, critical: bool) -> str:
    if alert_group.channel.mobile_app_title_template is None:
        return "New Important Alert" if critical else "New Alert"
    return _get_templated_alert(alert_group).title


def _ensure_push_notification_subtitle_length(subtitle: str) -> str:
    """
    Limit the subtitle length to prevent FCM `message is too big` exception.
    https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages
    """
    if len(subtitle) > MAX_ALERT_TITLE_LENGTH:
        return f"{subtitle[:MAX_ALERT_TITLE_LENGTH]}..."
    return subtitle


def get_push_notification_subtitle(alert_group: AlertGroup) -> str:
    templated_alert = _get_templated_alert(alert_group)

    if alert_group.channel.mobile_app_message_template is not None:
        # TODO: do we need to "emojize" this?
        return _ensure_push_notification_subtitle_length(templated_alert.message)

    alert_title = _ensure_push_notification_subtitle_length(str_or_backup(templated_alert.title, "Alert Group"))

    status_verbose = "Firing"  # TODO: we should probably de-duplicate this text
    if alert_group.resolved:
        status_verbose = alert_group.get_resolve_text()
    elif alert_group.acknowledged:
        status_verbose = alert_group.get_acknowledge_text()

    number_of_alerts = alert_group.alerts.count()
    if number_of_alerts <= 10:
        alerts_count_str = str(number_of_alerts)
    else:
        alert_count_rounded = (number_of_alerts // 10) * 10
        alerts_count_str = f"{alert_count_rounded}+"

    alert_status = f"Status: {status_verbose}, alerts: {alerts_count_str}"

    subtitle = (
        f"#{alert_group.inside_organization_number} {alert_title}\n"
        + f"via {alert_group.channel.short_name}"
        + f"\n{alert_status}"
    )

    return emojize(subtitle, language="alias")
