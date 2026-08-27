import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  /** atraso em segundos, para escalonar elementos vizinhos */
  delay?: number;
  /** distância inicial em px */
  y?: number;
  /** direção da entrada */
  from?: "bottom" | "left" | "right";
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  from = "bottom",
  className,
}: RevealProps) {
  const reduce = useReducedMotion();

  // Rede de segurança: no HTML do servidor o conteúdo sai VISÍVEL.
  // O estado inicial escondido só é aplicado depois que o React hidrata —
  // ou seja, se o JS falhar ou não carregar, o site continua legível.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  const offset =
    reduce || from === "bottom"
      ? { y: reduce ? 0 : y, x: 0 }
      : { y: 0, x: from === "left" ? -y : y };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{
        duration: reduce ? 0.3 : 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
