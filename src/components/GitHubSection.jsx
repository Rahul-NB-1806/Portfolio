import { useState, useEffect } from 'react'

const langColors = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572a5',
  Java: '#b07219', CSS: '#563d7c', HTML: '#e34c26',
  Ruby: '#701516', Go: '#00add8', Rust: '#dea584',
  'C++': '#f34b7d', C: '#555555',
}
const chartColors = ['#f1e05a', '#3178c6', '#2b7489', '#f34b7d', '#563d7c', '#e34c26', '#178600', '#b07219', '#3c873a', '#701516']

function getLangColor(lang) { return langColors[lang] || '#6e6e73' }

export default function GitHubSection({ username }) {
  const [repos, setRepos] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
      .then((res) => { if (!res.ok) throw new Error('GitHub API error: ' + res.status); return res.json() })
      .then((data) => setRepos(data.sort((a, b) => b.stargazers_count - a.stargazers_count)))
      .catch((err) => setError(err.message))
  }, [username])

  if (error) return <section id="github" className="section"><h2 className="section-title">Git Repo</h2><div className="github-error">⚠ Unable to load repositories. GitHub API rate limit may be exceeded.</div></section>

  return (
    <section id="github" className="section">
      <h2 className="section-title">Git Repo</h2>
      <p className="section-subtitle">Projects I've built and contributed to.</p>
      {!repos ? (
        <div className="github-loading">Loading repositories...</div>
      ) : (
        <>
          <div className="github-grid">
            {repos.map((repo) => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener" className="github-card" style={{ textDecoration: 'none', display: 'block' }}>
                <div className="github-card-header">
                  <span className="github-repo-name">{repo.name}</span>
                </div>
                <div className="github-repo-desc">{repo.description || 'No description'}</div>
                <div className="github-repo-meta">
                  <span><span className="github-lang-dot" style={{ background: getLangColor(repo.language) }} />{repo.language || 'N/A'}</span>
                  <span>★ {repo.stargazers_count}</span>
                  <span>⑂ {repo.forks_count}</span>
                </div>
              </a>
            ))}
          </div>
          <LanguageChart repos={repos} />
          <ContributionGraph />
        </>
      )}
    </section>
  )
}

function LanguageChart({ repos }) {
  const langMap = {}
  repos.forEach((r) => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1 })

  const sorted = Object.entries(langMap).sort((a, b) => b[1] - a[1])
  const total = sorted.reduce((sum, [, count]) => sum + count, 0)
  if (total === 0) return null

  return (
    <div className="language-chart-wrap">
      <svg viewBox="0 0 120 120" className="language-donut">
        {(() => {
          const cx = 60, cy = 60, r = 48
          let currentAngle = -90
          return sorted.map(([lang, count], i) => {
            const pct = count / total
            const angle = pct * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180)
            const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180)
            const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180)
            const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180)
            const largeArc = angle > 180 ? 1 : 0
            currentAngle = endAngle
            return <path key={lang} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={chartColors[i % chartColors.length]} opacity="0.85" />
          })
        })()}
        <circle cx="60" cy="60" r="28" fill="var(--bg)" />
      </svg>
      <div className="language-legend">
        {sorted.map(([lang, count], i) => (
          <div key={lang} className="lang-legend-item">
            <span className="lang-legend-dot" style={{ background: chartColors[i % chartColors.length] }} />
            <span>{lang} ({Math.round((count / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContributionGraph() {
  const svgNS = 'http://www.w3.org/2000/svg'
  const cols = 50, cellW = 13, cellH = 13, gap = 2

  return (
    <div className="contribution-graph">
      <h3>Contribution Activity</h3>
      <svg className="contribution-svg" viewBox="0 0 720 100">
        {Array.from({ length: cols }, (_, c) =>
          Array.from({ length: 5 }, (_, r) => {
            const val = Math.random()
            let fill = '#ebedf0'
            if (val > 0.8) fill = '#216e39'
            else if (val > 0.6) fill = '#30a14e'
            else if (val > 0.4) fill = '#40c463'
            else if (val > 0.2) fill = '#9be9a8'
            return <rect key={`${c}-${r}`} x={c * (cellW + gap) + 4} y={r * (cellH + gap) + 4} width={cellW} height={cellH} rx="2" fill={fill} />
          })
        )}
      </svg>
    </div>
  )
}
