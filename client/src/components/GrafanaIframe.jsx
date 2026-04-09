import React from 'react'

function GrafanaIframe() {
  return (
    <div className='p-4'>
        <h1>Grafana with Iframe</h1>
        <iframe src="http://localhost:3003/d-solo/adckdth/new-dashboard?orgId=1&from=1775686737651&to=1775708337651&timezone=browser&panelId=panel-1&__feature.dashboardScene=true" width="950" height="400" ></iframe>
    </div>
  )
}

export default GrafanaIframe