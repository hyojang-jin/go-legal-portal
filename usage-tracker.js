/**
 * Gowid Legal Portal — Usage Tracker
 * 각 도구 페이지에 포함시켜 활용 이벤트를 localStorage에 기록
 *
 * 사용법:
 *   <script src="usage-tracker.js"></script>
 *   페이지 로드 시 자동으로 visit 기록
 *   수동 기록: usageTrack('scan') 또는 usageTrack('review')
 */
(function () {
  const STORAGE_KEY = 'gowid_usage_log';
  const MAX_ENTRIES = 5000;

  // 현재 페이지에서 도구명 자동 감지
  function detectTool() {
    const path = location.pathname.split('/').pop().toLowerCase();
    if (path.includes('gommon-sense')) return 'Gommon Sense';
    if (path.includes('gotrack-lookup') || path.includes('gotrack-live')) return 'Go_track Live';
    if (path.includes('gotrack-v')) return 'Go_track';
    if (path.includes('godrop')) return 'GoDrop';
    if (path.includes('gowid-legal-portal') || path === '' || path === 'index.html') return 'Portal';
    return path.replace('.html', '');
  }

  function getLog() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }

  function saveLog(log) {
    // 오래된 항목 자동 정리
    if (log.length > MAX_ENTRIES) log = log.slice(-MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }

  function track(action) {
    const log = getLog();
    log.push({
      tool: detectTool(),
      action: action || 'visit',
      ts: new Date().toISOString()
    });
    saveLog(log);
  }

  // 페이지 로드 시 visit 자동 기록
  track('visit');

  // 글로벌 함수로 노출 (scan, review 등 수동 기록용)
  window.usageTrack = function (action) {
    track(action);
  };
})();
