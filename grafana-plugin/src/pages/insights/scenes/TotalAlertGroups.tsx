import { ThresholdsMode } from '@grafana/data';
import { SceneFlexItem, SceneQueryRunner, VizPanel } from '@grafana/scenes';

export default function getTotalAlertGroupsScene() {
  const query = new SceneQueryRunner({
    datasource: { uid: '$datasource' },
    queries: [
      {
        disableTextWrap: false,
        editorMode: 'code',
        excludeNullMetadata: false,
        exemplar: false,
        expr: 'max_over_time(sum(avg without(pod, instance) ($alert_groups_total{slug=~"$instance", team=~"$team", integration=~"$integration"}))[1d:])',
        format: 'time_series',
        fullMetaSearch: false,
        instant: false,
        legendFormat: '__auto',
        range: true,
        refId: 'A',
        useBackend: false,
      },
    ],
  });

  return new SceneFlexItem({
    $data: query,
    body: new VizPanel({
      pluginId: 'stat',
      fieldConfig: {
        defaults: {
          color: {
            mode: 'thresholds',
          },
          mappings: [],
          thresholds: {
            mode: ThresholdsMode.Absolute,
            steps: [
              {
                color: 'text',
                value: null,
              },
            ],
          },
          unit: 'none',
        },
        overrides: [
          {
            matcher: {
              id: 'byName',
              options: 'Value',
            },
            properties: [
              {
                id: 'displayName',
                value: 'Total alert groups',
              },
            ],
          },
        ],
      },
      options: {
        colorMode: 'value',
        graphMode: 'none',
        justifyMode: 'center',
        orientation: 'auto',
        reduceOptions: {
          calcs: ['lastNotNull'],
          fields: '',
          values: false,
        },
        textMode: 'auto',
      },
      pluginVersion: '9.5.2',
      title: 'Total alert groups',
    }),
  });
}