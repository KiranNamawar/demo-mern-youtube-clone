import clsx from "clsx";

function Button({
  disabled,
  onClick,
  type,
  title,
  className,
  Icon,
  popoverTarget,
  active,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type ?? "button"}
      title={title}
      popoverTarget={popoverTarget}
      className={clsx(
        "flex items-center gap-2",
        { "btn-disabled": disabled },
        { "btn-active": active },
        { btn: !disabled && !active },
        className
      )}
    >
      {Icon && <Icon />}
      <span>{title}</span>
    </button>
  );
}

export default Button;
