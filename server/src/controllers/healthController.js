export function getHealth(_req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'devtrackr-api',
    timestamp: new Date().toISOString()
  })
}
