const HTTP_METHOD_LABEL_PATTERN = /^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/i;

/**
 * @param {string} label
 * @returns {{ method: string, path: string } | null}
 */
export function parseHttpMethodLabel(label) {
  const trimmed = label.trim();
  const match = trimmed.match(HTTP_METHOD_LABEL_PATTERN);
  if (!match) {
    return null;
  }
  const pathPart = match[2].trim();
  const pathSegments = pathPart.match(/^(\S+)([\s\S]*)$/);
  const path = pathSegments ? `${pathSegments[1].toLowerCase()}${pathSegments[2]}` : pathPart.toLowerCase();
  return {
    method: match[1].toUpperCase(),
    path,
  };
}

/**
 * @param {{ label: string, className?: string }} props
 */
export default function ApiMethodBadge({ label, className = '' }) {
  const parsed = parseHttpMethodLabel(label);
  if (!parsed) {
    return <span className={className}>{label}</span>;
  }
  const rootClassName = className.length > 0 ? `api-method-label ${className}` : 'api-method-label';
  return (
    <span className={rootClassName}>
      <span className="api-method-badge">{parsed.method}</span>
      <span className="api-method-label__path">{parsed.path}</span>
    </span>
  );
}
