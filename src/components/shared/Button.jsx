const variants = {
  primary: 'bg-amber-500 hover:bg-amber-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300',
  success: 'bg-green-500 hover:bg-green-600 text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ children, variant = 'primary', size = 'md', className = '', icon, ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </button>
  )
}
