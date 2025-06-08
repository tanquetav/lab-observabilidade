export const ES_ROLES = `apm_server:
  cluster: ['manage_ilm','manage_security','manage_api_key']
  indices:
    - names: ['apm-*', 'traces-apm*', 'logs-apm*', 'metrics-apm*']
      privileges: ['write','create_index','manage','manage_ilm']
    - names: ['.apm-source-map']
      privileges: ['read']
  applications:
    - application: 'apm'
      privileges: ['sourcemap:write','event:write','config_agent:read']
      resources: '*'
beats:
  cluster: ['manage_index_templates','monitor','manage_ingest_pipelines','manage_ilm', 'manage_security','manage_api_key']
  indices:
    - names: ['filebeat-*','shrink-filebeat-*']
      privileges: ['all']
filebeat:
  cluster: ['manage_index_templates','monitor','manage_ingest_pipelines','manage_ilm']
  indices:
    - names: ['filebeat-*','shrink-filebeat-*']
      privileges: ['all']
heartbeat:
  cluster: ['manage_index_templates','monitor','manage_ingest_pipelines','manage_ilm']
  indices:
    - names: ['heartbeat-*','shrink-heartbeat-*']
      privileges: ['all']
metricbeat:
  cluster: ['manage_index_templates','monitor','manage_ingest_pipelines','manage_ilm']
  indices:
    - names: ['metricbeat-*','shrink-metricbeat-*']
      privileges: ['all'] `;

export const VERSION = "9.0.2";
export const VERSION2 = "9.0.0";
//8.6.2

export const ES_USERS = `admin:$2a$10$xiY0ZzOKmDDN1p3if4t4muUBwh2.bFHADoMRAWQgSClm4ZJ4132Y.
apm_server_user:$2a$10$iTy29qZaCSVn4FXlIjertuO8YfYVLCbvoUAJ3idaXfLRclg9GXdGG
apm_user_ro:$2a$10$hQfy2o2u33SapUClsx8NCuRMpQyHP9b2l4t3QqrBA.5xXN2S.nT4u
beats_user:$2a$10$LRpKi4/Q3Qo4oIbiu26rH.FNIL4aOH4aj2Kwi58FkMo1z9FgJONn2
filebeat_user:$2a$10$sFxIEX8tKyOYgsbJLbUhTup76ssvSD3L4T0H6Raaxg4ewuNr.lUFC
heartbeat_user:$2a$10$nKUGDr/V5ClfliglJhfy8.oEkjrDtklGQfhd9r9NoFqQeoNxr7uUK
kibana_system_user:$2a$10$nN6sRtQl2KX9Gn8kV/.NpOLSk6Jwn8TehEDnZ7aaAgzyl/dy5PYzW
metricbeat_user:$2a$10$5PyTd121U2ZXnFk9NyqxPuLxdptKbB8nK5egt6M5/4xrKUkk.GReG`;

export const ES_USERS_ROLES = `apm_server:apm_server_user
apm_system:apm_server_user
apm_user:apm_server_user,apm_user_ro
beats:beats_user
beats_system:beats_user,filebeat_user,heartbeat_user,metricbeat_user
filebeat:filebeat_user
heartbeat:heartbeat_user
ingest_admin:apm_server_user
kibana_system:kibana_system_user
kibana_user:apm_user_ro,beats_user,filebeat_user,heartbeat_user,metricbeat_user
metricbeat:metricbeat_user
superuser:admin`;
