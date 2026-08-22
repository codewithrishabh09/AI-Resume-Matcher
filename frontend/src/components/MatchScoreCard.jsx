import SkillBadge from './SkillBadge'

export default function MatchScoreCard({ result }) {
  const score = result?.match_score || 0

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBarColor = (score) => {
    if (score >= 75) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Match Analysis</h2>
        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Match Score</span>
          <span>{result?.recommendation}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getBarColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">
            {result?.skill_match_percentage?.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Skill Match</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">
            {result?.semantic_similarity?.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Semantic Match</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">
            {result?.experience_years}
          </div>
          <div className="text-xs text-gray-500 mt-1">Years Exp</div>
        </div>
      </div>

      {/* Matching skills */}
      {result?.matching_skills?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            ✅ Matching Skills ({result.matching_skills.length})
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
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            ❌ Missing Skills ({result.missing_skills.length})
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
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            📚 Learning Resources
          </h3>
          <div className="space-y-2">
            {result.skill_recommendations.map(rec => (
              <div key={rec.skill} className="text-sm p-2 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-700">{rec.skill}:</span>
                <span className="text-blue-600 ml-1">{rec.resource}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {result?.summary && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{result.summary}</p>
        </div>
      )}
    </div>
  )
}