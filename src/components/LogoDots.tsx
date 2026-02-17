interface LogoDotsProps {
  className?: string; // Para pasar clases como 'navbar__logo' o 'footer__dots'
  dotClassName?: string; // Para pasar el prefijo de la clase del punto (ej. 'navbar__logo-dot')
}

/** Componente de marca: Los 3 puntos fluorescentes */
export function LogoDots({ className = "logo-dots", dotClassName = "dot" }: LogoDotsProps) {
  return (
    <div className={className}>
      <div className={`${dotClassName} ${dotClassName}--pink`} />
      <div className={`${dotClassName} ${dotClassName}--yellow`} />
      <div className={`${dotClassName} ${dotClassName}--green`} />
    </div>
  );
}
