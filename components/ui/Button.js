const Button = ({
  iconLeft,
  iconRight,
  color = 'red',
  children,
  className,
  ...rest
}) => {
  return (
    <button
      className={`flex w-fit items-center rounded-md border-2 border-${color}-400 py-1 px-2 text-${color}-400 transition-colors ease-in hover:bg-${color}-400 hover:text-white ${className}`}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}

export default Button
