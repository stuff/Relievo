import { CircleNotchIcon } from '@phosphor-icons/react';
import styles from './Spinner.module.scss';

/**
 * An action in progress, as a spinning ring. Sized and colored like any other icon: drop it
 * anywhere one is expected, such as `startIcon`. Decorative — pair it with text that says what is
 * loading.
 */
export function Spinner() {
  return <CircleNotchIcon className={styles.spinner} />;
}
