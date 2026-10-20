export function Button({ children, icon: Icon, variant = 'secondary', className = '', ...props }) {
  return (
    <button className={`button button-${variant} ${className}`.trim()} {...props}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </button>
  );
}
