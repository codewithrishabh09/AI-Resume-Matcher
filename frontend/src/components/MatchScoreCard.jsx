import SkillBadge from './SkillBadge'

export default function MatchScoreCard({ result }) {
  const score = result?.match_score || 0

  const getScoreColor = (s) => {
    if (s >= 75) return 'text-green-400'
    if (s >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getBarColor = (s) => {
    if (s >= 75) return 'from-green-500 to-emerald-400'
    if (s >= 50) return 'from-yellow-500 to-amber-400'
    return 'from-red-500 to-rose-400'
  }

  const getGlow = (s) => {
    if (s >= 75) return 'shadow-green-500/30'
    if (s >= 50) return 'shadow-yellow-500/30'
    return 'shadow-red-500/30'
  }

  return (
    <div className="card-glow space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Match Analysis</h2>
        <div className={`text-5xl font-black ${getScoreColor(score)}`}>
          {score}%
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/40">Match Score</span>
          <span className="text-white/60 font-medium">{result?.recommendation}</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full bg-gradient-to-r ${getBarColor(score)} shadow-lg ${getGlow(score)} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Skill Match', value: `${result?.skill_match_percentage?.toFixed(0)}%` },
          { label: 'Semantic', value: `${result?.semantic_similarity?.toFixed(0)}%` },
          { label: 'Experience', value: `${result?.experience_years}yr` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
            <div className="text-2xl font-bold gradient-text">{value}</div>
            <div className="text-xs text-white/40 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Matching skills */}
      {result?.matching_skills?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Matching Skills ({result.matching_skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matching_skills.map(skill => (
              <SkillBadge key={skill} skill={skill} type="match" />
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {result?.missing_skills?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            Missing Skills ({result.missing_skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.map(skill => (
              <SkillBadge key={skill} skill={skill} type="missing" />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result?.skill_recommendations?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">📚 Learning Resources</h3>
          <div className="space-y-2">
            {result.skill_recommendations.map(rec => (
              <div key={rec.skill} className="text-sm p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
                <span className="font-medium text-violet-400">{rec.skill}:</span>
                <span className="text-white/50 ml-1">{rec.resource}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {result?.summary && (
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <p className="text-sm text-white/40">{result.summary}</p>
        </div>
      )}
    </div>
  )
}