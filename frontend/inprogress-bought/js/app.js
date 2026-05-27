// ═══════════════════════════════════════════
// 小助手 · 进行中-已购买 — App 组件
// ═══════════════════════════════════════════

const App = () => {
  const [rulesExp, setRulesExp] = React.useState(false);
  const [inviteExp, setInviteExp] = React.useState(true);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    requestAnimationFrame(() => { setEntered(true); });
  }, []);

  const pct = prog.total > 0 ? ((prog.cur / prog.next) * 100).toFixed(0) : 0;
  const need = Math.max(prog.next - prog.cur, 0);

  // 动态激励文案
  const motiveText = need > 0
    ? `当前已成功邀请 <em>${prog.cur}</em> 名，距下一奖励还差 <em>${need}</em> 名`
    : `恭喜完成本期目标！`;

  return (
    <div className={`page-container ${entered ? 'entered' : ''}`} style={{ position: 'relative' }}>

      {/* 纸屑飘落 — 氛围层（L2 CSS 动画）*/}
      <div className="confetti-container">
        {[...Array(12)].map((_, i) => {
          const colors = ['#FFD700', '#F0D68A', '#D4A017', '#B8860B', '#FFF0D9'];
          const left = 5 + Math.random() * 90;
          const delay = Math.random() * 8;
          const duration = 6 + Math.random() * 6;
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className="confetti"
              style={{
                left: left + '%',
                animationDelay: delay + 's',
                animationDuration: duration + 's',
                background: color,
                width: 4 + Math.random() * 4 + 'px',
                height: 6 + Math.random() * 6 + 'px',
                transform: 'rotate(' + Math.random() * 360 + 'deg)',
              }}
            />
          );
        })}
      </div>

      {/* ── Top Bar ── */}
      <div className="top-bar" style={{ justifyContent: 'flex-end' }}>
        <div className="record-button">
          <svg className="record-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="record-text">参与记录</span>
        </div>
      </div>

      {/* ── Title ── */}
      <div className="page-title">
        <h1>
          夏日派对
          <span style={{ display: 'inline-block', width: 6, height: 6, margin: '0 10px', background: '#D4A017', borderRadius: '50%', verticalAlign: 'middle' }} />
          一起狂欢
        </h1>
        <div className="subtitle">SUMMER CARNIVAL</div>
      </div>

      {/* ── 倒计时 ── */}
      <div className="countdown-compact">
        <span className="countdown-compact-label">距活动结束</span>
        <div className="countdown-compact-digits">
          <div className="countdown-unit">
            <span className="countdown-num">{String(cd.days).padStart(2, '0')}</span>
            <span className="countdown-label-sm">天</span>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <span className="countdown-num">{String(cd.hours).padStart(2, '0')}</span>
            <span className="countdown-label-sm">时</span>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <span className="countdown-num">{String(cd.minutes).padStart(2, '0')}</span>
            <span className="countdown-label-sm">分</span>
          </div>
        </div>
      </div>

      {/* ── 目标激励 ── */}
      <div className="motive-card">
        <div className="motive-text" dangerouslySetInnerHTML={{ __html: motiveText }} />
        <div className="progress-row">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: pct + '%' }} />
            {parseInt(pct) === 0 && <div className="progress-dot" />}
          </div>
          <span className="progress-text">获奖进度 <b>{prog.cur}</b> / {prog.next}</span>
        </div>
      </div>

      {/* ── 蝴蝶结分隔线 ── */}
      <div className="ribbon-divider">
        <svg viewBox="0 0 120 18" fill="none">
          <ellipse cx="48" cy="9" rx="18" ry="7" fill="#D4983A" opacity="0.4" />
          <ellipse cx="48" cy="9" rx="8" ry="4" fill="none" stroke="#A87B2E" strokeWidth="0.8" opacity="0.3" />
          <ellipse cx="72" cy="9" rx="18" ry="7" fill="#D4983A" opacity="0.4" />
          <ellipse cx="72" cy="9" rx="8" ry="4" fill="none" stroke="#A87B2E" strokeWidth="0.8" opacity="0.3" />
          <line x1="56" y1="11" x2="50" y2="16" stroke="#B8860B" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <line x1="64" y1="11" x2="70" y2="16" stroke="#B8860B" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <circle cx="60" cy="8" r="4" fill="#D4A017" opacity="0.7" />
          <circle cx="60" cy="7.5" r="1.5" fill="#FFF8F0" opacity="0.3" />
        </svg>
      </div>

      {/* ── 奖励阶梯 ── */}
      <div className="tiers-section">
        <div className="tiers-header">奖励阶梯</div>
        {tiers.map((t) => {
          const cls = t.done ? 'achieved' : (t.cur ? 'current' : 'pending');
          return (
            <div key={t.t} className={`tier-item ${cls}`}>
              <div className="tier-number">
                {t.done
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                  : t.t}
              </div>
              <span className="tier-condition">{t.cond}</span>
              <span className="tier-reward">{t.reward}</span>
            </div>
          );
        })}
      </div>

      {/* ── 邀请记录 ── */}
      <div className="invite-section">
        <div className="invite-header" onClick={() => setInviteExp(!inviteExp)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="invite-title">邀请记录</span>
            <span className="invite-count">({invites.length})</span>
          </div>
          <div className={`invite-arrow ${inviteExp ? 'rotated' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div className={`invite-list ${inviteExp ? 'expanded' : ''}`}>
          {invites.length > 0 ? (
            invites.map((item, i) => (
              <div key={i} className="invite-card">
                <div className="invite-avatar">
                  <span className="invite-avatar-text">{item.name.charAt(0)}</span>
                </div>
                <div className="invite-info">
                  <div className="invite-name">{item.name}</div>
                  <div className="invite-time">{item.time}</div>
                </div>
                <div className="invite-status">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  已成功
                </div>
              </div>
            ))
          ) : (
            <div className="invite-empty">
              <div className="invite-empty-icon">
                <svg viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="16" width="48" height="32" rx="4" stroke="#D4C4B0" strokeWidth="2" />
                  <polyline points="8,16 32,32 56,16" stroke="#D4C4B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="20" y1="54" x2="44" y2="54" stroke="#D4C4B0" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="invite-empty-text">
                还没有成功邀请任何好友哦<br />快去分享吧！
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 活动规则 ── */}
      <div className="rules-section">
        <div className="rules-toggle" onClick={() => setRulesExp(!rulesExp)}>
          <svg className="rules-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="rules-toggle-text">活动规则</span>
          <svg className={`rules-toggle-arrow ${rulesExp ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        {rulesExp && (
          <div className="rules-content expanded">
            <div className="rules-card">
              <div className="rules-rich-text">
                {rules.map((r, i) => <p key={i}>{r}</p>)}
              </div>
              <div className="rules-footer-line" />
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="page-footer">
        <span className="footer-brand">夏日派对</span>
        <span>一起狂欢</span>
        <span>2026</span>
      </div>

      {/* ── Bottom CTA — 去分享 ── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 16px 34px',
        background: 'linear-gradient(180deg, rgba(255,248,240,0) 0%, rgba(255,248,240,0.95) 20%, var(--cream-bg) 100%)',
        zIndex: 10,
        animation: 'ctaFloat 0.5s cubic-bezier(0.16,1,0.3,1) 1s both',
      }}>
        <div className="cta-share-wrap">
          <button className="cta-share-button">
            <svg viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            去分享
            <span className="cta-sweep" />
          </button>
        </div>
      </div>

    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
