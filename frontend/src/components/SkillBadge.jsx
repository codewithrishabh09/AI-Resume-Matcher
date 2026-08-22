export default function SkillBadge({ skill, type = 'default' }) {
  const styles = {
    default: 'bg-gray-100 text-gray-700',
    match: 'bg-green-100 text-green-700',
    missing: 'bg-red-100 text-red-700',
    primary: 'bg-indigo-100 text-indigo-700',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {skill}
    </span>
  )
}