import { DataSourceVariable, QueryVariable } from '@grafana/scenes';

import { InsightsConfig } from './Insights.types';

const DEFAULT_VARIABLE_CONFIG: Partial<ConstructorParameters<typeof QueryVariable>[0]> = {
  hide: 0,
  includeAll: true,
  isMulti: true,
  options: [],
  refresh: 1,
  regex: '',
  skipUrlSync: false,
  sort: 0,
  type: 'query',
};

const getVariables = ({ isOpenSource }: InsightsConfig) => [
  // Selectable
  new DataSourceVariable({
    name: 'datasource',
    label: 'Data source',
    pluginId: 'prometheus',
    ...(isOpenSource && { value: 'grafanacloud-usage' }),
  }),
  new QueryVariable({
    ...DEFAULT_VARIABLE_CONFIG,
    name: 'instance',
    label: 'Instance',
    text: ['All'],
    value: ['$__all'],
    datasource: { uid: '$datasource' },
    definition: 'label_values(${alert_groups_total},slug)',
    query: {
      query: 'label_values(${alert_groups_total},slug)',
      refId: 'PrometheusVariableQueryEditor-VariableQuery',
    },
  }),
  new QueryVariable({
    ...DEFAULT_VARIABLE_CONFIG,
    name: 'team',
    label: 'Team',
    text: ['All'],
    value: ['$__all'],
    datasource: { uid: '$datasource' },
    definition: 'label_values(${alert_groups_total}{slug=~"$instance"},team)',
    query: {
      query: 'label_values(${alert_groups_total}{slug=~"$instance"},team)',
      refId: 'PrometheusVariableQueryEditor-VariableQuery',
    },
    refresh: 2,
  }),
  new QueryVariable({
    ...DEFAULT_VARIABLE_CONFIG,
    name: 'integration',
    label: 'Integration',
    text: ['All'],
    value: ['$__all'],
    datasource: { uid: '$datasource' },
    definition: 'label_values(${alert_groups_total}{team=~"$team",slug=~"$instance"},integration)',
    query: {
      query: 'label_values(${alert_groups_total}{team=~"$team",slug=~"$instance"},integration)',
      refId: 'PrometheusVariableQueryEditor-VariableQuery',
    },
    refresh: 2,
  }),

  // Non-selectable
  new QueryVariable({
    ...DEFAULT_VARIABLE_CONFIG,
    name: 'alert_groups_total',
    label: 'alert_groups_total',
    datasource: { uid: '$datasource' },
    query: {
      query: 'metrics(alert_groups_total)',
      refId: 'PrometheusVariableQueryEditor-VariableQuery',
    },
    text: ['oncall_alert_groups_total', 'grafanacloud_oncall_instance_alert_groups_total'],
    value: ['oncall_alert_groups_total', 'grafanacloud_oncall_instance_alert_groups_total'],
    definition: 'metrics(alert_groups_total)',
    hide: 2,
    includeAll: false,
  }),
  new QueryVariable({
    ...DEFAULT_VARIABLE_CONFIG,
    name: 'user_was_notified_of_alert_groups_total',
    label: 'user_was_notified_of_alert_groups_total',
    datasource: { uid: '$datasource' },
    definition: 'metrics(user_was_notified_of_alert_groups_total)',
    query: {
      query: 'metrics(user_was_notified_of_alert_groups_total)',
      refId: 'PrometheusVariableQueryEditor-VariableQuery',
    },
    hide: 2,
    refresh: 2,
  }),
  new QueryVariable({
    ...DEFAULT_VARIABLE_CONFIG,
    name: 'alert_groups_response_time_seconds_bucket',
    label: 'alert_groups_response_time_seconds_bucket',
    datasource: { uid: '$datasource' },
    definition: 'metrics(alert_groups_response_time_seconds_bucket)',
    query: {
      query: 'metrics(alert_groups_response_time_seconds_bucket)',
      refId: 'PrometheusVariableQueryEditor-VariableQuery',
    },
    hide: 2,
  }),
  new QueryVariable({
    ...DEFAULT_VARIABLE_CONFIG,
    name: 'alert_groups_response_time_seconds_sum',
    label: 'alert_groups_response_time_seconds_sum',
    datasource: { uid: '$datasource' },
    definition: 'metrics(alert_groups_response_time_seconds_sum)',
    query: {
      query: 'metrics(alert_groups_response_time_seconds_sum)',
      refId: 'PrometheusVariableQueryEditor-VariableQuery',
    },
    hide: 2,
  }),
  new QueryVariable({
    ...DEFAULT_VARIABLE_CONFIG,
    name: 'alert_groups_response_time_seconds_count',
    label: 'alert_groups_response_time_seconds_count',
    datasource: { uid: '$datasource' },
    definition: 'metrics(alert_groups_response_time_seconds_count)',
    query: {
      query: 'metrics(alert_groups_response_time_seconds_count)',
      refId: 'PrometheusVariableQueryEditor-VariableQuery',
    },
    hide: 2,
  }),
];

export default getVariables;