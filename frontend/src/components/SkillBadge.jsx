export default function SkillBadge({ skill, type = 'default' }) {
  const styles = {
    default: 'badge-default',
    match: 'badge-match',
    missing: 'badge-missing',
    primary: 'badge-primary',
  }

  return (
    <span className={`badge ${styles[type]}`}>
      {skill}
    </span>
  )
}