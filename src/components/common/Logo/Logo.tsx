import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
}

export function Logo({ size = 'md', linkTo = '/' }: LogoProps) {
  const logoContent = (
    <div className={`${styles.logo} ${styles[size]}`}>
      <span className={styles.icon}>📄</span>
      <span className={styles.text}>
        Primeiro<span className={styles.highlight}>CV</span>
      </span>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={styles.link}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
